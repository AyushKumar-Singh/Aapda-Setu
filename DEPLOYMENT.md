# Aapda Setu - Deployment Guide

Complete guide for deploying the Aapda Setu disaster response platform.

---

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker Desktop installed and running
- At least 8GB RAM available
- Ports 3000, 5000, 6379, 8000, 8001, 27017 free

### Quick Start

```bash
# Navigate to infra folder
cd infra

# Copy environment template
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Seed database with sample data
docker exec aapda-api-gateway npx ts-node src/scripts/seed.ts
```

### Service URLs
| Service | URL |
|---------|-----|
| Admin Dashboard | http://localhost:3000 |
| API Gateway | http://localhost:5000 |
| ML CPU Service | http://localhost:8000 |
| ML GPU Service | http://localhost:8001 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

### Stop Services
```bash
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

---

## 🔧 Manual Setup (Development)

### Step 1: Install Prerequisites

#### Windows
```powershell
# Install Node.js 18+ from https://nodejs.org
# Install Python 3.9+ from https://python.org
# Install MongoDB from https://www.mongodb.com/try/download/community
# Install Redis using WSL or Docker
```

#### macOS
```bash
brew install node@18 python@3.9 mongodb-community redis
brew services start mongodb-community
brew services start redis
```

#### Linux (Ubuntu/Debian)
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python
sudo apt install python3.9 python3-pip python3-venv

# MongoDB
sudo apt install mongodb

# Redis
sudo apt install redis-server
sudo systemctl start redis
```

---

### Step 2: Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
# Windows: Start MongoDB service from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb

# Connect and create database
mongosh
> use Aapda-Setu
> db.createCollection("reports")
> db.createCollection("alerts")
> db.createCollection("users")
```

#### Option B: Docker MongoDB (Recommended)
```bash
# Start MongoDB container
docker run -d \
  --name aapda-mongo \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:5.0

# Start Redis container
docker run -d \
  --name aapda-redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### Option C: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create new cluster (free tier available)
3. Add database user with password
4. Whitelist your IP (or 0.0.0.0/0 for development)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/Aapda-Setu
   ```
6. Update `.env` with connection string

---

### Step 3: Backend API Gateway

```bash
cd backend/api-gateway

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings:
# - MONGODB_URI=mongodb://localhost:27017/Aapda-Setu
# - REDIS_HOST=localhost
# - JWT_SECRET=your-secret-key

# Start development server
npm run dev
```

Server runs on: http://localhost:5000

#### Test API Health
```bash
curl http://localhost:5000/health
```

---

### Step 4: ML Services

#### ML CPU Service (Text Analysis)
```bash
cd backend/ml-service-cpu

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### ML GPU Service (Image Analysis)
```bash
cd backend/ml-service-gpu

python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

#### AI Service (Flask)
```bash
cd backend/ai-service

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

python app.py
```

---

### Step 5: Admin Dashboard

```bash
cd admin-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard runs on: http://localhost:3000

---

### Step 6: Seed Database

```bash
cd backend/api-gateway

# Run seed script
npx ts-node src/scripts/seed.ts
```

This creates sample:
- 6 users (admin, verifier, responder, etc.)
- 5 disaster reports (fire, flood, earthquake, etc.)
- 4 emergency alerts

---

## 🌐 Production Deployment

### Environment Variables

```env
# Required for production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aapda-setu
REDIS_HOST=redis-server-host
JWT_SECRET=strong-random-secret-min-32-chars
ALLOWED_ORIGINS=https://yourdomain.com
```

### Using Docker Compose (Production)

```bash
cd infra

# Use production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale api-gateway=3
```

### Cloud Deployment Options

| Platform | Service | Use For |
|----------|---------|---------|
| Vercel | Frontend | Admin Dashboard |
| Railway | Backend | API Gateway |
| Render | Backend | ML Services |
| MongoDB Atlas | Database | MongoDB |
| Redis Cloud | Cache | Redis |
| AWS EC2/ECS | All | Full stack |
| Google Cloud Run | All | Containers |

### Vercel Deployment (Dashboard)

```bash
cd admin-dashboard
npm i -g vercel
vercel login
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_MAP_STYLE_URL`

---

## 🛠️ Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Check Docker container
docker ps | grep mongo
docker logs aapda-mongo
```

### Redis Connection Failed
```bash
# Check Redis
redis-cli ping

# Check Docker container
docker logs aapda-redis
```

### Port Already in Use
```bash
# Find process using port (Windows)
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Find process using port (macOS/Linux)
lsof -i :5000
kill -9 <pid>
```

### Docker Build Failed
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## 📊 Health Checks

```bash
# API Gateway
curl http://localhost:5000/health

# ML CPU Service
curl http://localhost:8000/health

# ML GPU Service  
curl http://localhost:8001/health

# Full health check script
cd infra
./scripts/health-check.sh
```

---

## 📁 Project Structure

```
Aapda-Setu/
├── admin-dashboard/     # Next.js frontend
├── backend/
│   ├── api-gateway/     # Node.js API (port 5000)
│   ├── ml-service-cpu/  # FastAPI text ML (port 8000)
│   ├── ml-service-gpu/  # FastAPI image ML (port 8001)
│   └── ai-service/      # Flask AI service
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── dockerfiles/
│   ├── nginx/
│   └── scripts/
├── lib/                 # Flutter mobile app
└── DEPLOYMENT.md        # This file
```
