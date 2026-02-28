from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ultralytics import YOLO
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import sqlite3
import os
import uuid
import json

# ==============================
# LOAD ENV VARIABLES
# ==============================

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
DATABASE = os.getenv("DATABASE", "database.db")

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"]

if not SECRET_KEY:
    raise ValueError("SECRET_KEY not set in .env file")

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# DATABASE
# ==============================

def get_connection():
    return sqlite3.connect(DATABASE, check_same_thread=False)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS detections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            filename TEXT,
            total_objects INTEGER,
            detections TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()

@app.on_event("startup")
def startup():
    init_db()

# ==============================
# LOAD MODEL
# ==============================

model = YOLO("yolov8s.pt")

# ==============================
# AUTH HELPERS
# ==============================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user(username: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username, password FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"username": row[0], "password": row[1]}
    return None

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = get_user(username)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return username

    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

# ==============================
# ROUTES
# ==============================

@app.get("/")
def root():
    return {"message": "AI Object Detection Backend Running Securely"}

# ------------------------------
# SIGNUP
# ------------------------------

@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...)):
    if get_user(username):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(password)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
    conn.commit()
    conn.close()

    return {"message": "User created successfully"}

# ------------------------------
# LOGIN
# ------------------------------

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)

    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": form_data.username})

    return {"access_token": access_token, "token_type": "bearer"}

# ------------------------------
# DETECT (PROTECTED)
# ------------------------------

@app.post("/detect")
async def detect_product(
    file: UploadFile = File(...),
    confidence: float = Form(0.25),
    current_user: str = Depends(get_current_user),
):

    if confidence < 0 or confidence > 1:
        raise HTTPException(status_code=400, detail="Confidence must be between 0 and 1")

    extension = file.filename.split(".")[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG, PNG allowed")

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (Max 5MB)")

    os.makedirs("uploads", exist_ok=True)

    unique_name = f"{uuid.uuid4()}.{extension}"
    file_path = f"uploads/{unique_name}"

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    try:
        results = model(file_path, conf=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

    detected_items = []

    for r in results:
        if r.boxes is not None:
            for box in r.boxes:
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                conf_score = float(box.conf[0])

                detected_items.append({
                    "object": class_name,
                    "confidence": round(conf_score, 2)
                })

    record = {
        "filename": file.filename,
        "total_objects": len(detected_items),
        "detections": detected_items,
        "timestamp": datetime.utcnow().isoformat(),
    }

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO detections (username, filename, total_objects, detections, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (
        current_user,
        record["filename"],
        record["total_objects"],
        json.dumps(record["detections"]),
        record["timestamp"]
    ))
    conn.commit()
    conn.close()

    return record

# ------------------------------
# HISTORY
# ------------------------------

@app.get("/history")
def get_history(current_user: str = Depends(get_current_user)):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT filename, total_objects, detections, timestamp
        FROM detections
        WHERE username=?
        ORDER BY id DESC
    """, (current_user,))

    rows = cursor.fetchall()
    conn.close()

    history = []

    for row in rows:
        history.append({
            "filename": row[0],
            "total_objects": row[1],
            "detections": json.loads(row[2]),
            "timestamp": row[3]
        })

    return history