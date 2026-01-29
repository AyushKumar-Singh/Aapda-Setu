# Aapda Setu - Deployment Guide

Complete deployment guide for the Aapda Setu AI Disaster & Emergency Response MVP.

---

## 🚀 Quick Start (Hackathon Demo)

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ installed
- Ollama installed ([download](https://ollama.ai))
- Flutter SDK installed
- Android phone on same WiFi as laptop

### 1-Minute Setup

```bash
# 1. Start MongoDB (Docker)
docker-compose up -d

# 2. Start Ollama
ollama serve

# 3. Create AI model (first time only)
cd backend/ollama && ollama create aapda-assistant -f Modelfile

# 4. Start backend
cd backend/api-gateway
npm install
npm run dev

# 5. Build APK (optional - use existing release)
flutter build apk --release
```

---

## 📱 Local MVP Startup (Hackathon Demo)

### Step 1: Start MongoDB via Docker

```bash
# From project root
docker-compose up -d

# Verify MongoDB is running
docker ps | grep mongodb
# Expected: aapda-mongodb running on port 27017

# Check logs if needed
docker logs aapda-mongodb
```

### Step 2: Start Node.js Backend

```bash
cd backend/api-gateway

# Install dependencies (first time)
npm install

# Copy environment file (first time)
cp .env.example .env

# Edit .env if needed - ensure these are set:
# MONGODB_URI=mongodb://127.0.0.1:27017/aapdasetu
# OLLAMA_URL=http://127.0.0.1:11434

# Start development server
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════╗
║       ✅ MongoDB Connected Successfully    ║
╠════════════════════════════════════════════╣
║  Database: aapdasetu                       ║
║  Host: 127.0.0.1:27017                     ║
╚════════════════════════════════════════════╝

🚀 API Gateway running on port 5000
```

### Step 3: Start Ollama Server

```bash
# In a new terminal
ollama serve

# First time only - create the model
cd backend/ollama
ollama create aapda-assistant -f Modelfile
```

**Verify Ollama is working:**
```bash
curl http://127.0.0.1:11434/api/tags
# Should list available models including aapda-assistant
```

### Step 4: Connect Phone APK to Laptop

1. **Find your laptop's LAN IP:**
   ```powershell
   # Windows
   ipconfig
   # Look for "IPv4 Address" under WiFi adapter (e.g., 192.168.1.100)
   ```

2. **Update Flutter app (if rebuilding):**
   - Open `lib/services/api_service.dart`
   - Update line 33: `static const String _lanIP = '192.168.1.100';`
   - Rebuild APK

3. **Install APK on phone:**
   - Transfer APK to phone
   - Install and open app
   - Ensure phone is on same WiFi network

### Step 5: Verify Everything Works

```bash
# Test all health endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/health/db
curl http://localhost:5000/api/v1/health/ollama
curl http://localhost:5000/api/v1/health/all

# Expected: All services show "status": "ok"
```

---

## 📦 Build Release APK

### Clean Build

```bash
# Navigate to project root
cd c:\Users\ayush\Desktop\Aapda-Setu

# Clean previous builds
flutter clean

# Get dependencies
flutter pub get

# Build release APK
flutter build apk --release
```

**Output location:**
```
build/app/outputs/flutter-apk/app-release.apk
```

### Build App Bundle (Play Store)

```bash
flutter build appbundle --release
```

**Output location:**
```
build/app/outputs/bundle/release/app-release.aab
```

---

## 🏷️ GitHub Release Instructions

### Create a New Release

1. **Go to GitHub Releases:**
   - Navigate to: https://github.com/AyushKumar-Singh/Aapda-Setu/releases
   - Click "Draft a new release"

2. **Create a Tag:**
   - Click "Choose a tag"
   - Enter version: `v1.0.0` (or next version)
   - Click "Create new tag: v1.0.0 on publish"

3. **Fill Release Details:**
   ```
   Release title: v1.0.0 - Hackathon MVP

   ## What's New
   - AI-powered disaster chatbot using Ollama
   - Interactive map with OpenStreetMap
   - Real-time incident reporting
   - MongoDB-backed alert system

   ## Installation
   1. Download app-release.apk below
   2. Enable "Install from unknown sources"
   3. Install and open the app
   4. Connect to backend at your laptop's IP

   ## Requirements
   - Android 6.0+ (API 23)
   - Backend server running on local network
   ```

4. **Upload APK:**
   - Drag `build/app/outputs/flutter-apk/app-release.apk`
   - Wait for upload to complete

5. **Publish:**
   - Click "Publish release"

---

## 🔧 Troubleshooting

### MongoDB Case Conflict Fix

**Problem:** `MongoServerError: database names are case insensitive`

**Solution:**
```bash
# Connect to MongoDB
docker exec -it aapda-mongodb mongosh

# Drop the conflicting database
use admin
db.dropDatabase()

# Or rename (not supported directly - export/import instead)
```

**Prevention:** Always use lowercase `aapdasetu` in:
- `.env` files
- `docker-compose.yml`
- All connection strings

### Ollama Offline Fallback

**Problem:** Chatbot shows "AI Assistant temporarily unavailable"

**Check Ollama status:**
```bash
# Is Ollama running?
curl http://127.0.0.1:11434/api/tags

# If connection refused:
ollama serve

# Is model loaded?
ollama list
# Should show: aapda-assistant

# If model missing:
cd backend/ollama
ollama create aapda-assistant -f Modelfile
```

**Test chatbot directly:**
```bash
curl -X POST http://localhost:5000/api/v1/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What to do during earthquake?"}'
```

### Phone Cannot Reach Backend IP

**Problem:** Flutter app cannot connect to backend

**Checklist:**
1. ✅ Phone and laptop on same WiFi network
2. ✅ Correct LAN IP in `api_service.dart`
3. ✅ Backend running on `0.0.0.0:5000` (not just localhost)
4. ✅ Windows Firewall allows port 5000

**Fix Windows Firewall:**
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Aapda Setu API" dir=in action=allow protocol=tcp localport=5000
```

**Test from phone browser:**
```
http://192.168.1.100:5000/health
# Replace with your laptop's IP
```

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

### Docker Container Issues

**Problem:** MongoDB container not starting

**Solution:**
```bash
# Check container status
docker ps -a

# View logs
docker logs aapda-mongodb

# Restart container
docker-compose restart mongodb

# Full reset (WARNING: deletes data)
docker-compose down -v
docker-compose up -d
```

---

## 📊 Health Check Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Basic API health |
| `GET /api/v1/health` | Detailed API status |
| `GET /api/v1/health/db` | MongoDB connection status |
| `GET /api/v1/health/ollama` | Ollama AI service status |
| `GET /api/v1/health/all` | Comprehensive system check |

**Pre-demo verification script:**
```powershell
# Run all health checks
$base = "http://localhost:5000"

Write-Host "Checking API..."
Invoke-RestMethod "$base/health"

Write-Host "Checking Database..."
Invoke-RestMethod "$base/api/v1/health/db"

Write-Host "Checking Ollama..."
Invoke-RestMethod "$base/api/v1/health/ollama"

Write-Host "Full System Check..."
Invoke-RestMethod "$base/api/v1/health/all"
```

---

## 📁 Project Structure

```
Aapda-Setu/
├── lib/                     # Flutter mobile app
│   ├── screens/            # App screens
│   ├── services/           # API service
│   ├── models/             # Data models
│   └── main.dart           # App entry point
├── backend/
│   ├── api-gateway/        # Node.js API (port 5000)
│   │   ├── src/
│   │   │   ├── routes/     # API endpoints
│   │   │   ├── models/     # MongoDB schemas
│   │   │   └── config/     # Database config
│   │   └── .env            # Environment config
│   └── ollama/             # AI model config
│       └── Modelfile       # Ollama model definition
├── docker-compose.yml      # MVP Docker setup
├── .env.example            # Environment template
├── DEPLOYMENT.md           # This file
└── build/                  # Flutter build outputs
```

---

## 🔒 Security Notes

**For Production Deployment:**

1. **Change JWT_SECRET** - Generate new secure secret
2. **Enable HTTPS** - Use SSL certificates
3. **Restrict CORS** - Limit to specific domains
4. **Use MongoDB Auth** - Enable authentication
5. **Firewall Rules** - Limit exposed ports
6. **Environment Variables** - Never commit `.env` files

---

## 📞 Emergency Contacts (Built into App)

- **National Emergency:** 112
- **Fire:** 101
- **Ambulance:** 108
- **Police:** 100
- **NDMA Helpline:** 1078
