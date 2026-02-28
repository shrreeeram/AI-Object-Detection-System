# 🎨 Visual Design & Component Guide

## Color Palette

### Primary Colors
```
Emerald (#10b981)  - ✨ Upload buttons, confirmations, success
Cyan (#06b6d4)     - 💫 Charts, timeline, accents
```

### Background Colors
```
Slate-900 (#0f172a) - Main background
Slate-800 (#1e293b) - Card backgrounds
Slate-700 (#334155) - Borders & dividers
```

### Text Colors
```
White (#ffffff)          - Primary text headings
Slate-100 (#f1f5f9)     - Secondary text
Slate-400 (#94a3b8)     - Tertiary text
Slate-500 (#64748b)     - Disabled text
```

### Accent Colors
```
Success: Green (#22c55e)
Error:   Red (#ef4444)
Warning: Yellow (#facc15)
Info:    Blue (#3b82f6)
```

---

## Component Hierarchy & Flow

```
App.jsx (Main)
│
├─ Navbar
│  ├─ Logo "AI ObjectDetect"
│  ├─ User badge with username
│  └─ Logout button
│
├─ Main Content (Grid Layout)
│  │
│  ├─ Left Column (1/3)
│  │  └─ UploadPanel
│  │     ├─ Drag-drop zone
│  │     ├─ Image preview
│  │     ├─ Confidence slider
│  │     └─ Action buttons (Clear, Run Detection)
│  │
│  └─ Right Column (2/3)
│     ├─ DetectionResults
│     │  ├─ Summary cards (Total, Highest)
│     │  ├─ Detection grid (cards with confidence bars)
│     │  └─ Empty state / No objects detected
│     │
│     ├─ AnalyticsDashboard
│     │  ├─ Stats cards (3 columns)
│     │  ├─ Frequency bar chart
│     │  └─ Timeline line chart
│     │
│     └─ HistoryPanel
│        ├─ Total runs badge
│        └─ Detection history table
│
└─ Toast Container (Fixed position)
   └─ Notifications stacked vertically
```

---

## Responsive Breakpoints

### Desktop (1024px+)
```
Header (full width)
├── Logo (left)
└── User + Logout (right)

Main Grid (3 columns):
├─ Upload (1/3)
└─ Results + Analytics + History (2/3)

Charts: Side by side (2 columns)
Table: Full width with horizontal scroll
```

### Tablet (768px - 1024px)
```
Header (stacked on mobile view)

Main Grid (1 column):
├─ Upload (full width)
├─ Results (full width)
├─ Analytics (full width)
└─ History (full width)

Charts: Stacked vertically
Table: Responsive columns
```

### Mobile (max 640px)
```
Header: Compact, hamburger ready

Main Stack (full width single column):
├─ Upload (mobile optimized)
├─ Results
├─ Analytics
└─ History (horizontal scroll)

Charts: Single column, scrollable
Table: Minimal columns, swipe enabled
Buttons: Full width, touch-friendly 44px height
```

---

## Typography

### Font Family
`Inter` - Professional, modern, clean

### Font Sizes
```
h1: 2.25rem (36px)  - Main dashboard title
h2: 1.5rem (24px)   - Section headings
h3: 1.125rem (18px) - Card titles
p:  0.875rem (14px) - Body text
sm: 0.75rem (12px)  - Captions, labels
xs: 0.625rem (10px) - Timestamps, meta
```

### Font Weights
```
Regular: 400 - Body text
Medium:  500 - Semi-bold labels
Semibold: 600 - Card headings
Bold:    700 - Main headings
Extrabold: 800 - Logo text "AI"
```

---

## Animation Timings

### Entrance Animations
```javascript
fadeIn: 260ms ease-out
Component appear with slight slide up
```

### Interaction Animations
```javascript
Hover: 150ms ease
Slide: 300ms ease-out
Spinner: 1000ms linear infinite
```

### Sequence
```
Page Load:
0ms   - Top section & title
100ms - Left upload panel
200ms - Right results panel
300ms - Analytics section
400ms - History section
```

---

## Component Specifications

### UploadPanel Size
```
Desktop width: 1/3 of container
Mobile width: 100%
Min height: 220px (upload area)
Max height: 400px with image preview
Padding: 20px
```

### Detection Result Card
```
Width: 160px (in grid)
Responsive: auto-fit, minmax(160px, 1fr)
Height: auto (content-based)
Padding: 10px
Border radius: 14px
```

### Chart Height
```
BarChart: 300px
LineChart: 300px
Responsive: Full width
Margins: 10px top, 20px right, 10px left, 20px bottom
```

### Table Row Height
```
Header: 36px
DataRow: 36px (32px padding + content)
Hover: Subtle background change
```

---

## Icon System

### Lucide React Icons Used

| Icon | Purpose | Size |
|------|---------|------|
| Upload | File upload | 12px |
| X | Close/Remove | 16px |
| User | User profile | 16px |
| LogOut | Sign out | 16px |
| Zap | Detection highlight | 20px |
| TrendingUp | Analytics | 20px |
| Clock | History timestamp | 20px |
| FileText | Document/File | 16px |
| CheckCircle | Success toast | 20px |
| AlertCircle | Error toast | 20px |
| Info | Info toast | 20px |

### Custom Emoji (Fallback)
```
🔍 No detection found
📊 Analytics
📋 History
🔥 Best detection
📈 Trending
```

---

## Shadow & Elevation System

### Shadow Levels (Tailwind)
```
shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow:      0 1px 3px 0 rgba(0, 0, 0, 0.1)
shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Glow Effects
```css
/* Upload button */
box-shadow: 0 0 20px #00ffcc, 
            0 18px 56px rgba(59, 130, 246, 0.8)

/* Card hover */
box-shadow: 0 0 12px rgba(16, 185, 129, 0.6)

/* Toast */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

---

## Spacing System

### Padding (16px base unit)
```
4px:  0.25rem (xs)
8px:  0.5rem  (sm)
12px: 0.75rem (md)
16px: 1rem    (lg)
20px: 1.25rem (xl)
24px: 1.5rem  (2xl)
32px: 2rem    (3xl)
```

### Margin/Gap
```
4px:  0.25rem
8px:  0.5rem
12px: 0.75rem
16px: 1rem
24px: 1.5rem
32px: 2rem
```

### Border Radius
```
8px:  0.5rem   - Small elements
12px: 0.75rem  - Buttons
14px: 0.875rem - Cards
18px: 1.125rem - Large panels
20px: 1.25rem  - Main sections
```

---

## State Indicators

### Loading State
```javascript
// Spinner animation
animation: rotate 360deg in 1000ms linear infinite

// Button shows:
"Analyzing..." with animated spinner
Disabled state (opacity: 0.6)
```

### Success State
```javascript
// Toast notification
Green badge + CheckCircle icon
Auto-dismiss after 3 seconds
```

### Error State
```javascript
// Toast notification
Red badge + AlertCircle icon
Auto-dismiss after 3 seconds
// OR
// Form validation
Red border on input
Red text below field
```

### Empty State
```javascript
// No detections
Large emoji (🔍)
"No objects detected"
Helpful message

// No history
Large emoji (📋)
"No detection history yet"
Call-to-action
```

---

## Glass-Morphism Effect

### CSS Pattern
```css
background: rgba(15, 23, 42, 0.85);
border: 1px solid rgba(148, 163, 184, 0.5);
backdrop-filter: blur(18px) saturate(160%);
box-shadow: 0 30px 80px rgba(15, 23, 42, 0.75);
border-radius: 18px;
```

### Applied To
- Card backgrounds
- Navbar
- Modal/Panel overlays
- Hover states

---

## Transition Effects

### Property Transitions
```css
color: 200ms ease
background: 200ms ease
border-color: 150ms ease
transform: 150ms ease (for hover scales)
opacity: 260ms ease-out (for fade-in)
```

### Button Hover
```css
transform: scale(1.05)
box-shadow: 0 0 20px #00ffcc
```

### Card Hover
```css
transform: translateY(-3px)
box-shadow: enhanced
border-color: brightened
```

---

## Accessibility Features

### Keyboard Navigation
- ✅ All buttons are keyboard accessible
- ✅ Focus visible styles (ring-2 ring-emerald-400)
- ✅ Tab order logical (top to bottom)

### Color Contrast
- ✅ Text on dark bg: WCAG AAA (7:1+ ratio)
- ✅ Focus indicators: High contrast rings
- ✅ Icons have text labels

### Semantic HTML
- ✅ `<button>` for clickables
- ✅ `<table>` for history
- ✅ `<label>` for form elements
- ✅ `<h1>`, `<h2>`, `<h3>` hierarchy

### Motion
- ✅ All animations under 1 second
- ✅ No autoplay videos
- ✅ Respect `prefers-reduced-motion`

---

## Design System Summary

| Element | Value |
|---------|-------|
| Primary Color | Emerald-400 |
| Secondary Color | Cyan-400 |
| Background | Slate-900 gradient |
| Font | Inter |
| Border Radius | 14-18px |
| Animation Time | 150-300ms |
| Shadow | 0 10px 15px negative |
| Padding | 16-24px |
| Gap | 8-24px |

This design system ensures:
- ✅ Consistent visual language
- ✅ Professional appearance
- ✅ Accessibility compliance
- ✅ Responsive across devices
- ✅ Smooth, polished interactions
