<<<<<<< HEAD
# 🚨 Aapda Setu - AI-Powered Disaster Response Management System

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-teal)](https://fastapi.tiangolo.com/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-blue)](https://flutter.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Real-time disaster reporting, ML-powered verification, and emergency alert broadcasting platform for India**

Aapda Setu is a comprehensive disaster management platform that leverages artificial intelligence for rapid disaster response coordination. The system enables citizens to report emergencies, uses ML models for automatic verification, and helps authorities coordinate relief efforts through a powerful admin dashboard.

---

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)
=======
# 🌐 Aapda Setu — AI-Powered Emergency & Disaster Response Platform  
**Real-time Alerts • AI Prioritization • Community Reporting • Geo-Intelligence**

Aapda Setu is an AI-driven emergency response system designed to deliver **instant disaster alerts**, **AI-based prioritization**, and **crowd-verified reporting**.  
Built for citizens, responders, NGOs, and authorities, it creates a unified ecosystem for **faster, safer, and smarter disaster coordination**.

---

## 🚀 Overview  
Aapda Setu enables users to:

- Receive **real-time alerts** for disasters (fire, flood, earthquake, etc.)  
- Report emergencies with **verified crowd intelligence**  
- Use an **AI agent** for guidance and safety information  
- Get **location-based notifications** within a 5 km radius  
- Stay informed even in low-connectivity areas through **offline SMS mode**

It integrates **AI, geofencing, community validation, and misinformation control** to deliver reliable, real-time emergency intelligence.

---

## 🎯 Objectives  
- Provide fast and accurate emergency alerts  
- Reduce misinformation in disaster reporting  
- Enable community-powered validation  
- Automate communication with authorities  
- Enhance public safety using predictive models & geo-intelligence  

---

## 🔥 Key Features

### **🔥 5 km Fire Alert System**
- Detects fire-related reports automatically  
- Alerts users within a 5 km radius  
- Auto-notifies the nearest fire department  

---

### **🤖 AI-Powered Alert Classification**
- Prioritizes alerts based on severity  
- NLP-powered description analysis  
- Detects duplicate or spam submissions  
- Image intelligence for authenticity checks  

---

### **🧭 Community-Based Verified Reporting**
- Trusted user system  
- Layered verification (Users → Moderators → NGOs → Authorities)  
- Reduces false alarms dramatically  

---

### **📶 Offline Mode (SMS Alerts)**
Even when internet fails:  
- Users get SMS alerts  
- Can report emergencies via text  

---

### **💬 AI Emergency Assistant**
- Provides step-by-step emergency guidance  
- Location-aware responses  
- Multi-language support  

---

### **🛡️ Misinformation Prevention**
- AI moderation + rule engine  
- Cross-checks reports with **NDMA, IMD**, and verified local data  
- Duplicate detection using NLP  
- Image forensics to prevent reused images  
>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850

---

## ✨ Features

<<<<<<< HEAD
### 📱 Mobile Application (Flutter)
- **Emergency Reporting**: Citizens can report disasters with photos, location, and description
- **Offline Support**: Queue reports when offline, auto-sync when connected
- **Real-time Alerts**: Geofenced push notifications for nearby emergencies
- **Emergency Chatbot**: AI-powered safety guidance using Ollama LLM
- **Multi-language**: Support for English, Hindi, and regional languages
- **Firebase Authentication**: Secure OTP-based login

### 💻 Admin Dashboard (Next.js)
- **Real-time Dashboard**: Live statistics and incident monitoring
- **Interactive Maps**: MapLibre GL with OpenStreetMap showing all incidents
- **Verification Queue**: Review and approve/reject citizen reports
- **Alert Broadcasting**: Create geofenced emergency alerts
- **User Management**: Role-based access control (Admin, Verifier, Responder)
- **Analytics**: Trend charts, disaster distribution, performance metrics
- **Export**: Download reports as CSV or PDF
- **Dark Mode**: Professional dark/light theme support

### 🤖 AI/ML Capabilities
- **Text Classification**: DistilBERT multilingual model for disaster type detection
- **Image Analysis**: EfficientNet/Xception for scene verification
- **Tamper Detection**: Forensic analysis to detect manipulated images
- **Duplicate Detection**: pHash-based duplicate report identification
- **Fusion Model**: LightGBM combining text, image, and metadata scores
- **Confidence Scoring**: Automatic verification for high-confidence reports
- **LLM Chatbot**: Ollama-powered emergency assistance

### 🔐 Security & Auth
- **Hybrid Authentication**: JWT for web admins + Firebase tokens for mobile
- **Role-Based Access**: User, Verifier, Responder, NGO Admin, Admin, Superadmin
- **Rate Limiting**: API protection against abuse
- **Multi-tenant**: Isolated data per organization/region
- **HMAC Signatures**: Secure ML service callbacks
- **S3 Presigned URLs**: Secure media uploads

### 🔔 Real-time Features
- **WebSocket**: Live updates for new reports, verifications, alerts
- **FCM Push Notifications**: Instant alerts to affected users
- **Geofencing**: Radius-based alert targeting
- **Auto-refresh**: Dashboard updates every 30 seconds

---

## 🏗 System Architecture
=======
### **Frontend (Mobile App)**
- Flutter (Cross-platform: Android + iOS)  
- Google Maps SDK  
- FCM Notifications  

### **Backend Services**
- Node.js / Flask microservices  
- API Gateway  
- Authentication service  
- Incident reporting service  
- AI analytics service  

### **Database**
- MongoDB Atlas (GeoJSON + NoSQL)  

### **AI / ML**
- TensorFlow  
- PyTorch  
- Hugging Face transformers  
- Anomaly detection (fire/flood patterns)  
- NLP moderation models  

### **Cloud & Infrastructure**
- AWS / Firebase / Google Cloud  
- Docker containers  
- Load-balanced microservices  

### **External APIs**
- NDMA alerts  
- IMD weather + seismic APIs  
- Local fire department integration  

---

## 🧠 AI/ML Capabilities

### **Automated Detection Engine**
- Identifies unusual reporting spikes  
- Detects generic or bot-like text  
- Flags duplicate or misleading reports  
- Image verification using forensic models  
- Confidence-based routing for human moderation  

---

### **Human-in-the-Loop System**
Aapda Setu uses multi-layer validation:

1. **User Reports**
2. **Nearby Verified Users**
3. **Volunteer Moderators**
4. **NGOs / Emergency Teams**
5. **Authorities**

This ensures **accuracy, authenticity, and trust**.

---

## 📱 Flutter App Features

### **Screens**
- Splash & Onboarding  
- OTP-based Login  
- Real-time Map Alerts  
- Report Incident (guided form)  
- Alerts Dashboard  
- AI Chatbot  
- Moderator Review Panel  
- Profile & Settings  
- Bottom Navigation (5-tab)  

---

## 🎨 UI Specifications
- Color Palette:  
  - 🔴 Primary Red: `#E53935`  
  - 🔵 Secondary Blue: `#1565C0`  
  - 🟢 Success Green: `#4CAF50`  
- Font: **Inter (Google Fonts)**  
- Border Radius: 10px  
- Material Design Shadows  

---

## 🧭 Project Structure (Flutter)
>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT APPLICATIONS                         │
├──────────────────────┬──────────────────────────────────────────┤
│  Flutter Mobile App  │      Next.js Admin Dashboard             │
│  (Firebase Auth)     │      (JWT Auth)                          │
└──────────┬───────────┴────────────┬─────────────────────────────┘
           │                        │
           │ HTTPS/REST             │ HTTPS/WebSocket
           ▼                        ▼
┌──────────────────────────────────────────────────────────────────┐
│              NODE.JS API GATEWAY (Port 3000)                      │
│  ┌────────────┬──────────────┬─────────────┬──────────────────┐ │
│  │ Auth       │ Reports      │ Alerts      │ Users/Analytics  │ │
│  │ Service    │ Service      │ Service     │ Export Service   │ │
│  └────────────┴──────────────┴─────────────┴──────────────────┘ │
│         Hybrid Auth (JWT + Firebase) | Rate Limiting             │
└───────┬────────────┬──────────────┬──────────────┬──────────────┘
        │            │              │              │
        │            │              │              └──────────────┐
        ▼            ▼              ▼                             ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐                  ┌──────────┐
│  MongoDB    │ │  Redis   │ │  AWS S3  │                  │ Firebase │
│  Atlas      │ │  Queue   │ │  Media   │                  │ Auth/FCM │
└─────────────┘ └────┬─────┘ └──────────┘                  └──────────┘
                     │
          ┌──────────┴────────────┐
          │   BULLMQ JOB QUEUES   │
          └──────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌───────────────────┐
│ FASTAPI ML CPU   │    │ FASTAPI ML GPU    │
│ (Port 8000)      │    │ (Port 8001)       │
├──────────────────┤    ├───────────────────┤
│ • DistilBERT     │    │ • EfficientNet    │
│ • LightGBM       │    │ • Xception        │
│ • Duplicate      │    │ • Tamper Detect   │
│   Detection      │    │ • Ollama LLM      │
└──────────────────┘    └───────────────────┘
```

---

<<<<<<< HEAD
## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **MapLibre GL** - Interactive maps
- **SWR** - Data fetching and caching
- **Recharts** - Analytics visualization
- **Axios** - HTTP client

### Backend (Node.js)
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database with ODM
- **Redis + BullMQ** - Job queues
- **Firebase Admin SDK** - Auth & FCM
- **AWS SDK** - S3 integration
- **Socket.IO** - WebSocket real-time
- **JWT** - Token-based auth
- **Swagger** - API documentation

### ML Services (Python)
- **FastAPI** - High-performance API
- **Transformers** - DistilBERT models
- **PyTorch** - Deep learning
- **LightGBM** - Gradient boosting
- **EfficientNet** - Image classification
- **Ollama** - LLM integration
- **OpenCV** - Image processing
- **ImageHash** - Duplicate detection

### Mobile (Flutter)
- **Dart** - Programming language
- **Dio** - HTTP client
- **Firebase Auth** - OTP authentication
- **FCM** - Push notifications
- **SQLite** - Offline storage
- **Google Maps** - Location services

### Testing
- **Jest + Supertest** - Backend API tests
- **Pytest** - ML service tests
- **Playwright** - E2E dashboard tests
- **k6** - Load testing
- **TestSprite** - AI safety testing
- **OWASP ZAP** - Security testing

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend deployment
- **AWS EC2** - Backend hosting
- **Nginx** - Reverse proxy
- **PM2** - Process management

---

## 📁 Project Structure

=======
## 🧪 Testing Guide (Onboarding)

### **Force Onboarding Always**
In `main.dart`:
```dart
static const bool _forceShowOnboarding = true;
```

### **Clear App Data**
>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850
```
Aapda-Setu/
├── admin-dashboard/              # Next.js Admin Dashboard
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/       # Main dashboard page
│   │   │   ├── map/             # Interactive map view
│   │   │   ├── verification/    # Report verification queue
│   │   │   ├── alerts/          # Alert management
│   │   │   ├── reports/         # All reports list
│   │   │   ├── analytics/       # Charts & stats
│   │   │   ├── users/           # User management
│   │   │   ├── settings/        # Settings page
│   │   │   └── layout.tsx       # Protected layout
│   │   ├── login/               # Login page
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home redirect
│   ├── components/ui/           # shadcn/ui components
│   ├── lib/
│   │   ├── api/client.ts        # Axios API client
│   │   └── utils.ts             # Utility functions
│   ├── tests/e2e.spec.ts        # Playwright tests
│   └── package.json
│
├── backend/
│   ├── api-gateway/             # Node.js API Gateway
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── database.ts  # MongoDB connection
│   │   │   │   ├── redis.ts     # Redis connection
│   │   │   │   ├── firebase.ts  # Firebase Admin
│   │   │   │   └── swagger.ts   # API docs config
│   │   │   ├── models/
│   │   │   │   ├── Report.model.ts
│   │   │   │   ├── Alert.model.ts
│   │   │   │   └── User.model.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── reports.routes.ts
│   │   │   │   ├── alerts.routes.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── analytics.routes.ts
│   │   │   │   ├── media.routes.ts
│   │   │   │   └── export.routes.ts
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── rateLimiter.middleware.ts
│   │   │   ├── services/
│   │   │   │   ├── websocket.service.ts
│   │   │   │   └── fcm.service.ts
│   │   │   ├── queues/ml.queue.ts
│   │   │   └── index.ts
│   │   ├── tests/reports.test.ts
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── ml-service-cpu/          # FastAPI Text/Fusion ML
│   │   ├── app/
│   │   │   └── main.py          # Text & fusion endpoints
│   │   ├── tests/test_ml_cpu.py
│   │   └── requirements.txt
│   │
│   └── ml-service-gpu/          # FastAPI Image/LLM ML
│       ├── app/
│       │   └── main.py          # Image & chat endpoints
│       └── requirements.txt
│
├── lib/                         # Flutter App
│   ├── services/
│   │   └── api_service.dart     # Dio API wrapper
│   ├── models/
│   ├── screens/
│   └── widgets/
│
├── tests/                       # Shared tests
│   ├── load-test.js             # k6 load testing
│   └── testsprite-config.yaml   # AI safety tests
│
├── .gitignore
├── LICENSE
└── README.md                    # This file
```

<<<<<<< HEAD
---

## 🚀 Quick Start

### Prerequisites

=======
### **ADB Reset**
>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850
```bash
# Required
- Node.js 18+
- Python 3.9+
- MongoDB 5.0+
- Redis 6.0+

# Optional
- Docker & Docker Compose
- Ollama (for LLM chatbot)
- AWS Account (for S3)
- Firebase Project (for mobile auth)
```

<<<<<<< HEAD
### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Aapda-Setu.git
cd Aapda-Setu
```

### 2. Backend API Gateway

```bash
cd backend/api-gateway

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI, Firebase credentials, etc.

# Run development server
npm run dev
```

Server runs on: `http://localhost:3000`

### 3. ML Services

```bash
# CPU Service
cd backend/ml-service-cpu
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

# GPU Service (separate terminal)
cd backend/ml-service-gpu
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 4. Next.js Dashboard

```bash
cd admin-dashboard

# Dependencies already installed
npm install

# Run development server
npm run dev
```

Dashboard runs on: `http://localhost:3001`

### 5. Access Dashboard

Navigate to: `http://localhost:3001/login`

---

## 📚 Detailed Setup

### Environment Variables

#### Backend API (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/aapda-setu

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key_here

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=aapda-setu-media

# ML Services
ML_CPU_URL=http://localhost:8000
ML_GPU_URL=http://localhost:8001

# FCM
FCM_SERVER_KEY=your_fcm_server_key
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NEXT_PUBLIC_MAP_STYLE_URL=https://demotiles.maplibre.org/style.json
=======
### **Debug Button Method**
(Temporary testing option)

---

## 🧰 Backend Microservices

```
backend/
├── ai-service/
├── api-gateway/
├── auth-service/
├── report-service/
└── notifications-service/
>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850
```

---

<<<<<<< HEAD
## 📖 API Documentation

### Swagger UI
Once backend is running, access interactive API docs at:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`
=======
## 🧠 Future Enhancements
- IoT fire sensors  
- Drone-based hazard detection  
- Predictive analytics for early disaster warnings  
- Voice-enabled emergency assistant  
- Blockchain for report authenticity  
- ML-driven risk scoring per region  
>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850

### Key Endpoints

<<<<<<< HEAD
#### Authentication
```bash
# Admin Login (JWT)
POST /api/v1/auth/admin/login
Body: { "email": "admin@example.com", "password": "password" }

# Mobile OTP Verification (Firebase)
POST /api/v1/auth/mobile/verify
Body: { "firebase_token": "..." }

# Get Current User
GET /api/v1/auth/me
Headers: Authorization: Bearer <token>
```

#### Reports
```bash
# Create Report
POST /api/v1/reports
Body: { "type": "fire", "severity": "high", ... }

# List Reports (with filters)
GET /api/v1/reports?type=fire&status=pending&page=1&limit=20

# Verify Report (Admin)
POST /api/v1/reports/:id/verify
Body: { "status": "verified", "note": "..." }
```

#### Alerts
```bash
# Create Emergency Alert (Admin)
POST /api/v1/admin/alerts
Body: {
  "type": "fire",
  "severity": "critical",
  "title": "...",
  "message": "...",
  "center": { "type": "Point", "coordinates": [lng, lat] },
  "radius_km": 5
}

# Get Active Alerts
GET /api/v1/alerts?status=active
```

#### Analytics
```bash
# Dashboard Stats
GET /api/v1/admin/analytics

# Reports Trend (7 days)
GET /api/v1/admin/analytics/trend?days=7

# Disaster Type Distribution
GET /api/v1/admin/analytics/disaster-types
```

#### Export
```bash
# Export Reports as CSV
GET /api/v1/export/reports/csv?from_date=2024-01-01&to_date=2024-12-31

# Export Reports as PDF
GET /api/v1/export/reports/pdf
```

---

## 🧪 Testing

### Backend API Tests (Jest)

```bash
cd backend/api-gateway
npm test

# With coverage
npm run test:coverage
```

### ML Service Tests (Pytest)

```bash
cd backend/ml-service-cpu
pytest -v tests/

# With coverage
pytest --cov=app tests/
```

### Frontend E2E Tests (Playwright)

```bash
cd admin-dashboard

# Install Playwright browsers (first time)
npx playwright install

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui
```

### Load Testing (k6)

```bash
# Install k6: https://k6.io/docs/getting-started/installation/

k6 run tests/load-test.js
```

### AI Safety Testing (TestSprite)

```bash
# Install TestSprite (if using)
# npm install -g testsprite

testsprite run --config tests/testsprite-config.yaml
```

### Test Coverage

- **Backend**: Jest tests for all API routes, authentication, rate limiting
- **ML Services**: Pytest tests for inference, performance, error handling
- **Frontend**: Playwright E2E tests for all pages, accessibility
- **Load**: k6 tests simulating 100+ concurrent users
-  **Security**: OWASP ZAP scans, rate limit verification
- **AI Safety**: Hallucination detection, PII leakage, prompt injection

---

## 🚢 Deployment

### Vercel (Next.js Dashboard)

```bash
cd admin-dashboard

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Environment Variables** (set in Vercel dashboard):
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_MAP_STYLE_URL`

### AWS EC2 (Backend Services)

#### Option 1: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api-gateway:
    build: ./backend/api-gateway
    ports:
      - "3000:3000"
    env_file:
      - ./backend/api-gateway/.env
    depends_on:
      - mongodb
      - redis

  ml-cpu:
    build: ./backend/ml-service-cpu
    ports:
      - "8000:8000"

  ml-gpu:
    build: ./backend/ml-service-gpu
    ports:
      - "8001:8001"
    runtime: nvidia  # If using GPU

volumes:
  mongo-data:
```

Run: `docker-compose up -d`

#### Option 2: PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start API Gateway
cd backend/api-gateway
npm run build
pm2 start npm --name "aapda-api" -- start

# Start ML services with Python
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name ml-cpu
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8001" --name ml-gpu

# Setup PM2 startup
pm2 startup
pm2 save
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.aapdasetu.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Coding Standards
- TypeScript for backend/frontend
- Python PEP 8 for ML services
- ESLint + Prettier for formatting
- Comprehensive tests required
- Documentation for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Ayush Kumar Singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Authors

**Ayush Kumar Singh**
- GitHub: [@AyushKumar-Singh](https://github.com/AyushKumar-Singh)
- Email: ayush@example.com

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For development assistance
- **Next.js Team** - Amazing React framework
- **FastAPI** - High-performance Python framework
- **MapLibre** - Open-source mapping
- **OpenStreetMap** - Free map data
- **Firebase** - Authentication & messaging
- **MongoDB** - Flexible database
- **All Contributors** - Community support

---

## 📞 Support

For support, email support@aapdasetu.in or join our Slack channel.

---

## 🗺 Roadmap

- [ ] **Q1 2025**: Production deployment
- [ ] **Q2 2025**: Mobile app beta release
- [ ] **Q3 2025**: Multi-language support (10+ Indian languages)
- [ ] **Q4 2025**: Integration with government emergency services
- [ ] **2026**: AI model improvements, predictive alerts

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **API Endpoints**: 25+
- **Test Coverage**: 85%+
- **Pages**: 9 admin pages + mobile app
- **ML Models**: 3 (Text, Image, Fusion)
- **Real-time**: WebSocket + FCM
- **Security**: OAuth2 + JWT + Firebase

---

<div align="center">

**Built with ❤️ in India for safer communities**

[Website](https://aapdasetu.in) • [Documentation](https://docs.aapdasetu.in) • [Demo](https://demo.aapdasetu.in)

</div>
=======
## ⚡ Advantages
- AI-prioritized, real-time alerts  
- Verified & high-trust crowd intelligence  
- Government API integration  
- Offline-ready design  
- Scalable microservices backend  
- Multi-language & accessible  

---

## 🏁 Conclusion  
**Aapda Setu** transforms traditional disaster response by combining **AI**, **geolocation**, **community verification**, and **real-time communication**.  
It is built to protect lives, speed up response, and strengthen emergency infrastructure across India.

---

## 📜 License  
© 2025 — Aapda Setu Disaster Management System  
All Rights Reserved.

>>>>>>> 34a91a4df4b1bf68f73b552190a6955868f0e850
