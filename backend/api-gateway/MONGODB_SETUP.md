# MongoDB Local Setup Guide for Aapda Setu

This guide ensures a stable, hackathon-safe MongoDB connection for local development.

---

## ✅ Prerequisites Checklist

- [ ] MongoDB installed on your system
- [ ] MongoDB Compass installed (optional but recommended)
- [ ] Node.js and npm installed
- [ ] Backend dependencies installed (`npm install` in `api-gateway`)

---

## 🚀 Quick Start

### 1. Verify MongoDB is Running

**Windows (Check Service):**
```powershell
# Check if MongoDB service is running
Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue | Select-Object Status, Name

# Or check for mongod process
Get-Process mongod -ErrorAction SilentlyContinue
```

**Start MongoDB Service (if not running):**
```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod manually
mongod --dbpath "C:\data\db"
```

### 2. Verify Connection with Compass

1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017/`
3. You should see the connection succeed
4. Database `aapda-setu` will be created automatically when the backend connects

### 3. Start the Backend

```powershell
cd backend/api-gateway
npm run dev
```

**Expected output:**
```
🔄 MongoDB connection attempt 1/3...

╔════════════════════════════════════════════╗
║       ✅ MongoDB Connected Successfully    ║
╠════════════════════════════════════════════╣
║  Database: aapda-setu                      ║
║  Host: 127.0.0.1:27017                     ║
╚════════════════════════════════════════════╝

✓ MongoDB connected
🚀 API Gateway running on port 5000
```

### 4. Test Health Endpoint

```powershell
# Test database health
curl http://localhost:5000/api/v1/health/db
```

**Expected response:**
```json
{
  "status": "ok",
  "database": "aapda-setu",
  "mongo": "connected",
  "host": "127.0.0.1:27017"
}
```

---

## 🔧 Environment Configuration

The `.env` file should contain:

```env
# MongoDB - Use 127.0.0.1 for stability (avoids DNS resolution issues)
MONGODB_URI=mongodb://127.0.0.1:27017/aapda-setu
```

> **Note:** Using `127.0.0.1` instead of `localhost` avoids potential DNS resolution issues on some Windows configurations.

---

## 🐛 Common Errors & Fixes

### Error: `ECONNREFUSED 127.0.0.1:27017`

**Cause:** MongoDB service is not running.

**Fix:**
```powershell
# Windows - Start service
net start MongoDB

# Or run mongod manually with data path
mongod --dbpath "C:\data\db"
```

---

### Error: MongoDB service won't start

**Cause:** Data directory doesn't exist or has permission issues.

**Fix:**
```powershell
# Create data directory if it doesn't exist
mkdir C:\data\db -Force

# Then start mongod
mongod --dbpath "C:\data\db"
```

---

### Error: Port 27017 already in use

**Cause:** Another process is using the MongoDB port.

**Fix:**
```powershell
# Find what's using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### Error: Compass connects but backend cannot

**Cause:** Different connection strings or firewall blocking Node.js.

**Fixes:**
1. Ensure `.env` uses `mongodb://127.0.0.1:27017/aapda-setu`
2. Check Windows Firewall isn't blocking Node.js
3. Restart the backend after `.env` changes

```powershell
# Allow Node.js through firewall (run as Administrator)
New-NetFirewallRule -DisplayName "Node.js" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

---

### Error: Connection timeout

**Cause:** MongoDB is overloaded or starting up slowly.

**Fix:** The backend has built-in retry logic (3 attempts with 5-second delays). If all retries fail:

1. Check MongoDB logs for errors
2. Restart MongoDB service
3. Ensure no other applications are heavily using MongoDB

---

### Error: Authentication failed

**Cause:** MongoDB has authentication enabled but credentials not provided.

**Fix:** For local development without auth:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/aapda-setu
```

For authenticated connections:
```env
MONGODB_URI=mongodb://username:password@127.0.0.1:27017/aapda-setu?authSource=admin
```

---

## 📊 Health Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Basic server health (uptime) |
| `GET /api/v1/health` | Detailed health with all services |
| `GET /api/v1/health/db` | Database-specific health check |

### Health Check Script

```powershell
# Quick health check
Invoke-RestMethod http://localhost:5000/api/v1/health/db | ConvertTo-Json
```

---

## 🎯 Hackathon Demo Tips

1. **Start MongoDB before the demo** - Run `mongod` at least 5 minutes before
2. **Test health endpoint** - Verify `/api/v1/health/db` returns `"status": "ok"`
3. **Keep Compass open** - Quick visual confirmation that data is being stored
4. **Have backup plan** - Know your common error fixes above

---

## 📁 Database Collections

The `aapda-setu` database contains these collections:

| Collection | Description |
|------------|-------------|
| `users` | User accounts and profiles |
| `reports` | Disaster incident reports |
| `alerts` | Emergency alerts and notifications |

---

## 🔄 Troubleshooting Flowchart

```
Backend won't connect to MongoDB
           │
           ▼
    Is mongod running?
      │         │
     NO        YES
      │         │
      ▼         ▼
  Start mongod  Check .env MONGODB_URI
      │         │
      │         ▼
      │    Is it 127.0.0.1:27017?
      │      │         │
      │     NO        YES
      │      │         │
      │      ▼         ▼
      │   Fix URI   Check firewall
      │              │
      └──────────────┘
              │
              ▼
         Restart backend
              │
              ▼
         Test /api/v1/health/db
```

---

## 📞 Support

If issues persist:
1. Check MongoDB logs: `C:\Program Files\MongoDB\Server\<version>\log\`
2. Check backend console for detailed error messages
3. Verify network with: `Test-NetConnection -ComputerName localhost -Port 27017`
