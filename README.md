AI Object Detection System
Full Stack Deep Learning Application with Cloud Deployment
Overview
The AI Object Detection System is a full stack web application designed to perform real-time object detection on user-uploaded images using a deep learning model. The system integrates a secure backend API, a modern interactive frontend interface, containerized deployment using Docker, and cloud hosting on Microsoft Azure.
The primary goal of this project was to move beyond a simple academic implementation and build a production-oriented system that demonstrates secure API design, AI model integration, DevOps practices, and cloud-native deployment.
The system allows authenticated users to upload images, perform object detection using YOLOv8, and store detection results securely in a database. Each detection is associated with a specific user, ensuring proper access control and data isolation.
Backend Development
The backend was developed using FastAPI due to its high performance, asynchronous capabilities, and automatic API documentation generation. The application runs on the Uvicorn ASGI server and follows a modular structure for maintainability and scalability.
Authentication is implemented using JWT tokens. During registration, user passwords are securely hashed using bcrypt through the Passlib library. During login, credentials are verified and a signed JWT token is generated using python-jose. This token is required to access protected endpoints such as object detection and history retrieval.
Environment variables are used for managing sensitive configuration values such as the SECRET_KEY and token expiry duration. This ensures that secrets are not hard-coded in the application and can be securely configured during deployment.
Input validation is handled using Pydantic models. File validation is implemented to restrict upload size and allow only specific image formats such as JPG, JPEG, and PNG. Proper error handling ensures that meaningful HTTP responses are returned for invalid inputs or authentication failures.
Detection results are stored in a SQLite database. Each detection record includes the username, filename, number of objects detected, detection details stored in JSON format, and timestamp. The history endpoint retrieves structured detection logs for the authenticated user.
AI Model Integration
The system integrates the YOLOv8 object detection model from Ultralytics. The model runs using PyTorch with CPU-based inference to maintain compatibility with lightweight cloud environments.
When a user uploads an image, the backend processes the image, applies a configurable confidence threshold, and extracts bounding box information along with object class names and confidence scores. The detection output is structured into a clean JSON response before being returned to the frontend and stored in the database.
The model is automatically downloaded during first execution and reused for subsequent inferences. Proper exception handling ensures that inference failures do not crash the backend service.
Frontend Development
The frontend was built using React with Vite as the build tool for optimized performance and faster development cycles. Axios is used for communication with the backend API.
The interface includes secure login and registration screens, a detection dashboard, analytics panels, and detection history visualization. Authentication tokens are stored in localStorage and attached as Bearer tokens in protected API requests.
The frontend is configured to dynamically switch API base URLs using environment variables, allowing seamless transition between local development and cloud deployment environments.
A production build is generated using the Vite build process, producing optimized static assets that can be deployed on cloud storage platforms.
Docker Containerization
To ensure portability and environment consistency, the backend was containerized using Docker. A Python slim base image was used to reduce image size while maintaining required dependencies.
The Dockerfile installs system libraries required for OpenCV and Torch, installs application dependencies from the requirements file, copies the project code, exposes port 8000, and runs the application using Uvicorn.
This approach eliminates machine-specific dependency issues and ensures that the application behaves identically across development and production environments. Containerization also simplifies cloud deployment and scaling.
Azure Cloud Deployment
The entire system was deployed on Microsoft Azure using a structured cloud architecture.
A Resource Group was created to logically organize all cloud components. The Docker image was pushed to Azure Container Registry, which serves as a private container repository. The backend was deployed using Azure Container Instance, where environment variables such as SECRET_KEY were securely injected.
The frontend production build was hosted using Azure Storage Account static website hosting. Static website hosting was enabled, and the build files were uploaded to the special $web container. This provided a publicly accessible HTTPS endpoint for the frontend.
The final architecture connects the browser to the Azure-hosted frontend, which communicates with the containerized backend API deployed in Azure. The backend processes detection requests using YOLOv8 and returns structured results to the user interface.
System Architecture
The deployed system follows a layered architecture consisting of:
Client Browser
Azure Static Website (Frontend)
Azure Container Instance (Backend API)
YOLOv8 Deep Learning Model
All components are grouped under a dedicated Azure Resource Group. The Docker image is stored securely in Azure Container Registry and pulled during container deployment.
Security Implementation
The system incorporates multiple layers of security. Passwords are hashed before storage. JWT tokens enforce authenticated access. Protected routes require Bearer token validation. Sensitive configuration values are stored as environment variables instead of hard-coded constants. File upload validation prevents unsupported file types and oversized inputs.
These mechanisms collectively ensure that the system follows secure API design practices suitable for production environments.
Project Outcome
This project demonstrates practical implementation of deep learning in a full-stack application with secure authentication and cloud deployment. It combines AI integration, backend engineering, frontend development, containerization, and cloud infrastructure management into a unified system.
The final result is a production-ready AI Object Detection platform capable of secure image-based inference, scalable cloud deployment, and structured user-specific data management.
