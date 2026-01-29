# 🚀 Aapda Setu - Render Deployment Guide

Complete step-by-step guide to deploy the API Gateway to Render.com.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository with the backend code pushed
- [ ] MongoDB Atlas cluster (free tier works) - [Create here](https://cloud.mongodb.com)
- [ ] Redis Cloud instance (free tier works) - [Create here](https://app.redislabs.com)
- [ ] Render account - [Sign up here](https://render.com)

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Verify Build Works Locally

```bash
cd backend/api-gateway
npm install
npm run build
```

Ensure no errors. The compiled files will be in `dist/`.

### 1.2 Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## 🌐 Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `aapda-setu-api` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend/api-gateway` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or paid for better performance) |

---

## 🔐 Step 3: Configure Environment Variables

In the Render Dashboard, go to your service → **Environment** tab.

### Required Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://...` | From MongoDB Atlas |
| `REDIS_HOST` | `redis-xxxxx.cloud.redislabs.com` | From Redis Cloud |
| `REDIS_PORT` | `12345` | From Redis Cloud |
| `REDIS_PASSWORD` | `your_password` | From Redis Cloud |
| `JWT_SECRET` | `<random-32-byte-string>` | Generate new for production! |

### Generate JWT Secret

Run this locally to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Optional Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `OLLAMA_URL` | *(leave empty)* | Ollama not available on Render |
| `ALLOWED_ORIGINS` | `https://your-frontend.com` | Your frontend URLs |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Requests per minute |

> **Note:** `PORT` is automatically set by Render - you don't need to configure it.

---

## 🚀 Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (2-5 minutes)
3. Check the logs for any errors

---

## ✅ Step 5: Verify Deployment

### 5.1 Health Check

Open your browser or run:

```bash
curl https://your-app-name.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-30T00:00:00.000Z",
  "uptime": 123.456
}
```

### 5.2 Full Health Check

```bash
curl https://your-app-name.onrender.com/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "api": "ok",
    "database": {
      "status": "connected",
      "name": "aapdasetu"
    }
  }
}
```

### 5.3 Test Chatbot Fallback

```bash
curl -X POST https://your-app-name.onrender.com/api/v1/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Help me with flood emergency"}'
```

**Expected Response (Fallback Mode):**
```json
{
  "success": true,
  "data": {
    "response": "⚠️ AI Assistant temporarily unavailable.\n\nFor emergencies, call:\n• Emergency: 112\n• Fire: 101\n• Ambulance: 108\n• Police: 100\n• NDMA: 1078",
    "is_fallback": true
  }
}
```

---

## 🔧 Troubleshooting

### Build Fails

1. Check the Render build logs
2. Ensure `package.json` has correct scripts:
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/index.js"
   }
   ```
3. Verify `tsconfig.json` has `"outDir": "./dist"`

### MongoDB Connection Error

1. Verify `MONGODB_URI` is correct
2. In MongoDB Atlas, ensure your IP is whitelisted:
   - Go to **Network Access** → **Add IP Address**
   - Add `0.0.0.0/0` to allow all IPs (for Render's dynamic IPs)

### Redis Connection Error

1. Verify `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD`
2. Redis is optional - the server will continue without caching

### CORS Errors

1. Add your frontend domain to `ALLOWED_ORIGINS`
2. For testing, the current config allows all origins

---

## 📱 Connecting Flutter App

Update your Flutter app's API base URL:

```dart
// lib/services/api_service.dart
static const String baseUrl = 'https://your-app-name.onrender.com/api/v1';
```

---

## 🌐 Connecting React Dashboard

Update your React app's environment:

```env
# .env.production
VITE_API_URL=https://your-app-name.onrender.com/api/v1
```

---

## 📊 Monitoring

### View Logs

In Render Dashboard → Your Service → **Logs** tab

### Check Service Status

```bash
curl https://your-app-name.onrender.com/api/v1/health/all
```

---

## 🔄 Redeployment

Render automatically redeploys when you push to the main branch. For manual deployment:

1. Go to Render Dashboard → Your Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📝 Quick Reference

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Basic health check |
| `GET /api/v1/health` | Full health with DB status |
| `GET /api/v1/health/db` | Database health only |
| `GET /api/v1/health/all` | All services status |
| `POST /api/v1/chatbot/chat` | AI Chatbot (with fallback) |
| `GET /api/v1/reports/public` | Get public reports |
| `POST /api/v1/auth/register` | User registration |
| `POST /api/v1/auth/login` | User login |

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas connection working
- [ ] Redis Cloud connection working (or graceful fallback)
- [ ] Health endpoint returns 200
- [ ] Chatbot returns fallback response
- [ ] CORS allows your frontend domains
- [ ] Flutter app connects successfully
- [ ] React dashboard connects successfully

---

**🎉 Your Aapda Setu API Gateway is now live on Render!**
