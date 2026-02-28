# Frontend Architecture - Production Build

## Directory Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx           # App navigation & user info
│   │   ├── UploadPanel.jsx       # File upload & confidence slider
│   │   ├── DetectionResults.jsx  # Shows object detections
│   │   ├── HistoryPanel.jsx      # Detection history table
│   │   ├── AnalyticsDashboard.jsx # Charts & analytics
│   │   └── Toast.jsx            # Notification system
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useToast.js          # Toast notification management
│   │
│   ├── services/             # API & external services
│   │   └── api.js               # Axios instance with JWT interceptors
│   │
│   ├── App.jsx              # Main application component
│   ├── App.css              # Tailwind + global styles
│   ├── index.css            # Base styles
│   └── main.jsx             # Application entry point
│
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies & scripts
```

## Key Technologies

- **React 19** - UI framework with hooks
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **Recharts** - Data visualization charts
- **Axios** - HTTP client with JWT interceptors

## Component Overview

### Navbar
- Displays logged-in username
- Shows logout button
- Animated entrance

### UploadPanel
- Drag-and-drop file upload
- Image preview
- Confidence threshold slider (0.1-0.9)
- Run Detection & Clear buttons
- Animated loading state

### DetectionResults
- Summary cards (total objects, highest confidence)
- Detection cards grid with confidence bars
- Empty states with animations
- Memoized for performance

### HistoryPanel
- Recent detection table (last 10)
- Filename, object count, detections, timestamp
- Empty state with styling

### AnalyticsDashboard
- Stats cards (total, average, max)
- Object frequency bar chart
- Detection timeline line chart
- Auto-responsive and interactive

### Toast
- Success, error, info notifications
- Auto-dismiss after 3 seconds
- Smooth entrance/exit animations

## API Integration

### Authentication Flow
- JWT token stored in `localStorage`
- Axios interceptor automatically attaches Bearer token
- 401 response triggers redirect to /auth
- Username also stored locally

### API Endpoints
- `POST /signup` - Register user
- `POST /login` - Login user
- `POST /detect` - Upload image & run detection (protected)
- `GET /history` - Fetch user's detection history (protected)

## Performance Optimizations

- `useMemo` for chart data calculation
- `useCallback` for stable function references
- Component memoization where needed
- Lazy loading compatible

## Styling Strategy

### Tailwind Classes
- Gradient backgrounds
- Backdrop blur effects
- Shadow & border utilities
- Responsive grid layouts

### Custom CSS
- Global animations (fadeIn, pulse, spin)
- Glass-morphism effects
- Scrollbar styling
- Form element customization

## Responsive Design

- Mobile-first approach
- Grid auto-adjusts from 3 columns to 1
- Sidebar badges hide on small screens
- Table columns compress on mobile
- Touch-friendly button sizes

## Features

✅ File upload with drag-and-drop
✅ Real-time image preview
✅ Confidence threshold control
✅ Detection results with visual cards
✅ Analytics charts (bar & line)
✅ Detection history with timestamps
✅ Toast notifications
✅ JWT authentication
✅ Dark theme with glassmorphism
✅ Smooth animations
✅ Mobile responsive
✅ Production-ready code

## Running the App

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- All components use functional React with hooks
- No class components or Redux required
- Axios handles auth headers automatically
- Components are fully isolated and reusable
- CSS combines Tailwind utilities with custom animations
