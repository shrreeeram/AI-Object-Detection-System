# 🚀 Complete Installation & Usage Guide

## Installation (Already Done ✅)

```bash
npm install react vite react-dom
npm install -D tailwindcss postcss autoprefixer
npm install framer-motion lucide-react recharts axios
```

## Running the Application

### Development Mode
```bash
cd frontend
npm run dev
```
Then open: **http://localhost:5173**

### Production Build
```bash
npm run build       # Creates optimized dist/ folder
npm run preview     # Preview production build
```

---

## File Structure Overview

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              (41 lines) - App header with logout
│   │   ├── UploadPanel.jsx         (87 lines) - Upload + slider + controls
│   │   ├── DetectionResults.jsx    (105 lines) - Results cards + stats
│   │   ├── HistoryPanel.jsx        (99 lines) - History table
│   │   ├── AnalyticsDashboard.jsx  (117 lines) - Charts + analytics
│   │   └── Toast.jsx               (43 lines) - Notifications
│   │
│   ├── hooks/
│   │   └── useToast.js             (24 lines) - Toast state management
│   │
│   ├── services/
│   │   └── api.js                  (35 lines) - Axios + JWT interceptors
│   │
│   ├── App.jsx                     (191 lines) - Main app
│   ├── App.css                     (400+ lines) - Styles + animations
│   ├── index.css                   (Tailwind base)
│   └── main.jsx                    (Vite entry point)
│
├── tailwind.config.js              - Tailwind configuration
├── postcss.config.js               - PostCSS configuration
├── vite.config.js                  - Vite configuration
├── package.json                    - Dependencies
├── ARCHITECTURE.md                 - Component architecture docs
└── TRANSFORMATION_SUMMARY.md       - Before/after comparison
```

---

## Environment Setup

### No env variables needed (config in code)
Backend URL is hardcoded in [src/services/api.js](src/services/api.js):
```javascript
const BACKEND_URL = 'http://aiobjectshree2026.southeastasia.azurecontainer.io:8000';
```

### To change backend endpoint:
Edit [src/services/api.js](src/services/api.js) line 3:
```javascript
const BACKEND_URL = 'http://aiobjectshree2026.southeastasia.azurecontainer.io:8000';
```

---

## Component API Reference

### Navbar
**Props:**
- `username` (string) - Current logged-in user
- `onLogout` (function) - Called when logout button clicked

**Usage:**
```jsx
<Navbar username={username} onLogout={handleLogout} />
```

### UploadPanel
**Props:**
- `onFileSelect` (function) - Called when file selected
- `confidence` (number) - Current confidence threshold
- `onConfidenceChange` (function) - Called when slider moved
- `onDetect` (function) - Called when Run Detection clicked
- `isLoading` (boolean) - Show loading state

**Usage:**
```jsx
<UploadPanel
  onFileSelect={setFile}
  confidence={confidence}
  onConfidenceChange={setConfidence}
  onDetect={handleDetect}
  isLoading={isLoading}
/>
```

### DetectionResults
**Props:**
- `result` (object) - Detection result from backend
- `isLoading` (boolean) - Show loading state

**Result Format:**
```json
{
  "filename": "image.jpg",
  "total_objects": 3,
  "detections": [
    {"object": "car", "confidence": 0.92},
    {"object": "person", "confidence": 0.88}
  ],
  "timestamp": "2024-02-19T10:30:45.123456"
}
```

### HistoryPanel
**Props:**
- `history` (array) - Array of detection records

**History Record Format:**
```json
{
  "filename": "image.jpg",
  "total_objects": 2,
  "detections": "[{...}]",
  "timestamp": "2024-02-19T10:30:45.123456"
}
```

### AnalyticsDashboard
**Props:**
- `history` (array) - Detection history array

**Features:**
- Calculates stats from history
- Renders frequency bar chart
- Renders timeline line chart
- Auto-responsive

### Toast Hook
**Import:**
```javascript
import useToast from './hooks/useToast';
```

**Usage:**
```javascript
const { toasts, showToast, removeToast } = useToast();

// Show notification
showToast('Image uploaded!', 'success', 3000);
showToast('Upload failed!', 'error', 3000);
showToast('Processing...', 'info', 0); // No auto-dismiss
```

**Toast Types:**
- `'success'` - Green badge with checkmark
- `'error'` - Red badge with alert icon
- `'info'` - Blue badge with info icon

---

## API Service (api.js)

### Setup
Already configured with JWT interceptors:
- **Request**: Automatically adds `Authorization: Bearer {token}`
- **Response**: Catches 401 and redirects to `/auth`

### Usage Examples

```javascript
import api from './services/api';

// GET Detection History
const response = await api.get('/history');
console.log(response.data); // Array of detection records

// POST Detection
const formData = new FormData();
formData.append('file', imageFile);
formData.append('confidence', 0.25);

const response = await api.post('/detect', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
console.log(response.data); // Detection result
```

---

## Styling System

### Tailwind CSS Classes Used
- Colors: `bg-slate-900`, `text-white`, `border-slate-700`
- Spacing: `p-6`, `gap-8`, `mb-12`
- Layout: `grid`, `flex`, `gap-*`
- Effects: `backdrop-blur-md`, `shadow-lg`, `rounded-2xl`
- Responsive: `lg:col-span-3`, `md:grid-cols-2`

### Custom Animations
Global animations defined in [src/App.css](src/App.css):
- `fadeIn` - Component entrance (260ms)
- `pulse` - Subtle breathing effect
- `spin` - Loading spinner rotation

### Dark Theme Colors
```javascript
Primary:    Emerald-400 (#10b981) - Upload, confirmation
Secondary: Cyan-400 (#06b6d4) - Accents, charts
Background: Slate-900 (#0f172a) - Dark base
Surface:    Slate-800 (#1e293b) - Cards
Text:       Slate-100 (#f1f5f9) - Primary text
Muted:      Slate-400 (#94a3b8) - Secondary text
```

---

## Authentication Flow

### 1. User Logs In (via /auth page)
- Submits username + password
- Backend validates → returns `access_token`

### 2. Token Storage
- Save in `localStorage.setItem('access_token', token)`
- Save username: `localStorage.setItem('username', username)`

### 3. App Initialization (App.jsx)
```javascript
useEffect(() => {
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');
  
  if (!token || !username) {
    window.location.href = '/auth'; // Not logged in
    return;
  }
  
  setUsername(username);
  // Fetch history...
}, []);
```

### 4. API Requests
- Axios interceptor automatically adds: `Authorization: Bearer {token}`
- 401 response → clears token → redirects to `/auth`

### 5. Logout
```javascript
const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
  window.location.href = '/auth';
};
```

---

## Common Tasks

### Change App Title
**File:** `index.html` line 6
```html
<title>AI Object Detection</title>
```

### Change Backend URL
**File:** `src/services/api.js` line 3
```javascript
const BACKEND_URL = 'http://aiobjectshree2026.southeastasia.azurecontainer.io:8000';
```

### Change Colors
**File:** `src/components/UploadPanel.jsx` line 29
```jsx
className="bg-gradient-to-r from-emerald-500 to-cyan-500..."
```

### Add New Component
1. Create `src/components/YourComponent.jsx`
2. Import in `App.jsx`
3. Add to JSX render
4. Pass required props

### Add Toast Notification
```javascript
import useToast from './hooks/useToast';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleSuccess = () => {
    showToast('Operation successful!', 'success');
  };
  
  return <button onClick={handleSuccess}>Click Me</button>;
}
```

---

## Performance Tips

### For Large File Uploads
```javascript
// Backend config (already done)
MAX_FILE_SIZE = 10MB

// Frontend validation
if (file.size > 10 * 1024 * 1024) {
  showToast('File too large', 'error');
  return;
}
```

### For Many Detections
- Frontend shows last 10 records
- Backend filters by user automatically
- Charts use `useMemo` to avoid recalculations

### Build Optimization
```bash
npm run build  # Automatically minifies & gzips
```

---

## Deploying to Production

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## Debugging

### Check Network Requests
Browser DevTools → Network tab:
- Look for failed `/detect` or `/history` calls
- Check response status (should be 2xx)
- Verify token in request headers

### Check Console Errors
Browser DevTools → Console:
- Look for Redux/state management errors
- Check API error messages
- Verify component prop types

### Test Backend Connection
```javascript
// In browser console
fetch('http://aiobjectshree2026.southeastasia.azurecontainer.io:8000/')
  .then(r => r.json())
  .then(data => console.log(data));
```

Expected response:
```json
{"message": "AI Object Detection Backend Running"}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check localStorage has `access_token` |
| 401 errors | Token expired, redirect to `/auth` |
| Upload fails | Check file size < 10MB |
| Charts empty | Ensure detection history populated |
| Styles not loading | Run `npm run build` or restart dev server |
| CORS error | Check backend CORS config allows frontend origin |

---

## Support & Documentation

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Recharts**: https://recharts.org
- **Axios**: https://axios-http.com

---

## Summary

You now have a **production-ready AI Object Detection dashboard** with:
- ✅ 6 modular, reusable components
- ✅ JWT authentication
- ✅ Real-time data visualization
- ✅ Dark theme with animations
- ✅ Mobile responsive design
- ✅ Error handling & notifications
- ✅ Optimized build pipeline

**Ready to deploy!** 🚀
