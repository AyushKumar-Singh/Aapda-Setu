# Aapda Setu - Web Admin Dashboard

Modern admin dashboard for the Aapda Setu disaster management platform. Built with React, TypeScript, Vite, and shadcn/ui.

## Features

- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🌓 **Dark Mode**: Full dark mode support
- 📱 **Responsive**: Mobile-first design
- 🔐 **Authentication**: JWT-based admin authentication
- 📊 **Analytics**: Real-time disaster statistics and charts
- 🗺️ **Interactive Maps**: MapLibre/OpenStreetMap integration
- ✅ **Report Verification**: AI-assisted report verification system
- 🚨 **Alert Management**: Create and manage emergency alerts
- 👥 **User Management**: User roles and permissions
- 🔄 **Real-time Updates**: WebSocket support for live data

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Hooks + Context
- **API Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000` (or configure in `.env`)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to configure your API endpoint:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# For production with real backend, set to false
VITE_ENABLE_MOCK_DATA=true
```

### 3. Run Development Server

```bash
npm run dev
```

The dashboard will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This creates optimized production files in `dist/` directory.

## Project Structure

```
web-dashboard/
├── src/
│   ├── api/                    # API integration
│   │   ├── client.ts           # Axios client with interceptors
│   │   ├── types.ts            # TypeScript types
│   │   ├── endpoints/          # API endpoint modules
│   │   │   ├── auth.ts
│   │   │   ├── reports.ts
│   │   │   ├── alerts.ts
│   │   │   ├── analytics.ts
│   │   │   └── users.ts
│   │   └── index.ts
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/                  # Page components
│   │   ├── LoginPage.tsx       # Authentication
│   │   ├── DashboardPage.tsx   # Main dashboard
│   │   ├── AlertsPage.tsx      # Alerts management
│   │   ├── MapPage.tsx         # Interactive map
│   │   ├── VerificationPage.tsx # Report verification
│   │   ├── ReportsPage.tsx     # Reports list
│   │   ├── AnalyticsPage.tsx   # Analytics & charts
│   │   ├── UsersPage.tsx       # User management
│   │   └── SettingsPage.tsx    # System settings
│   │
│   ├── context/                # React contexts
│   │   └── ThemeContext.tsx
│   │
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── public/                     # Static files
├── .env.example                # Environment template
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json

```

## Pages

### Dashboard (`/dashboard`)
- Overview statistics (reports, alerts, users, response time)
- Recent reports list
- Active alerts
- Verification stats
- Trend charts

### Live Alerts (`/alerts`)
- Active disaster alerts list
- Filter by type, severity, status
- Create new alerts
- View alert details

### Map View (`/map`)
- Interactive map with incident markers
- Cluster view for dense areas
- Real-time incident updates
- Geofence visualization

### Verification (`/verification`)
- Pending reports queue
- ML confidence scores
- Image forensics results
- Approve/reject actions

### Reports (`/reports`)
- All reports list with filters
- Export functionality
- Detailed report view
- Status management

### Analytics (`/analytics`)
- Reports trend charts
- Disaster type distribution
- Verification statistics
- Model performance metrics

### Users (`/users`)
- User management
- Role assignment
- Trust scores
- Ban/suspend actions

### Settings (`/settings`)
- Organization profile
- Notification preferences
- ML thresholds
- API keys management

## Authentication

The dashboard uses JWT-based authentication:

1. Admin logs in with email/password
2. Backend issues access token and refresh token
3. Tokens stored in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. Protected routes redirect to `/login` if not authenticated

**Development Mode**: With `VITE_ENABLE_MOCK_DATA=true`, any email/password works.

## API Integration

The dashboard connects to the backend API (default: `http://localhost:3000`).

### Available Endpoints

- `POST /api/v1/auth/admin/login` - Admin login
- `GET /api/v1/admin/analytics` - Dashboard statistics
- `GET /api/v1/reports` - List reports
- `GET /api/v1/alerts` - List alerts
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/reports/:id/verify` - Verify report
- `POST /api/v1/admin/alerts` - Create alert

### Mock Data Mode

When backend is not available, enable mock data:

```env
VITE_ENABLE_MOCK_DATA=true
```

This provides realistic dummy data for all pages during development.

## Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

### Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
```

### Nginx (Static)

Build and serve from nginx:

```nginx
server {
    listen 80;
    server_name admin.aapdasetu.in;
    root /var/www/aapdasetu-admin/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Development Tips

### Hot Reload
Vite provides instant hot module replacement (HMR). Changes appear immediately.

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npx eslint src/
```

### Component Development
Use Storybook or develop components in isolation:
```tsx
// Example: Test new component
import { MyComponent } from './components/MyComponent';

function App() {
  return <MyComponent />;
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:3000` |
| `VITE_MAP_STYLE_URL` | Map style JSON URL | OpenStreetMap demo tiles |
| `VITE_MAP_API_KEY` | Map provider API key | (optional) |
| `VITE_ENABLE_MOCK_DATA` | Use mock data | `true` |
| `VITE_ENABLE_WEBSOCKET` | Enable real-time updates | `false` |

## Troubleshooting

### Build Errors

**Module not found**: Run `npm install` again

**TypeScript errors**: Check `tsconfig.json` paths

### API Connection Issues

**CORS errors**: Configure backend to allow `http://localhost:5173`

**401 Unauthorized**: Check authentication token

**Network errors**: Verify backend is running

### Mock Data Not Working

Check `.env` file:
```env
VITE_ENABLE_MOCK_DATA=true
```

Restart dev server after changing environment variables.

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request

## License

Part of the Aapda Setu Disaster Management System.
All rights reserved © 2025.

---

**Built with ❤️ for disaster resilience**