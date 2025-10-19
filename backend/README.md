# Aapda Setu Backend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Install Node.js dependencies:**
```bash
cd api-gateway && npm install
cd ../auth-service && npm install  
cd ../report-service && npm install
```

2. **Install Python dependencies:**
```bash
cd ai-service
pip install -r requirements.txt
```

3. **Configure Environment:**
   - Update `.env` files in each service with your MongoDB URI
   - Get MongoDB URI from [MongoDB Atlas](https://cloud.mongodb.com)

4. **Start Services:**
   - **Windows:** Double-click `start-services.bat`
   - **Manual:** Run each service in separate terminals

### Services

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 5000 | Main entry point |
| Auth Service | 5002 | User authentication |
| Report Service | 5001 | Disaster reports |
| AI Service | 8000 | Report verification |

### API Endpoints

**Auth Service:**
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile

**Report Service:**
- `POST /create` - Create new report
- `GET /nearby?lat=X&lng=Y` - Get nearby reports
- `GET /:id` - Get specific report

**AI Service:**
- `POST /verify` - Verify report authenticity
- `POST /analyze-image` - Analyze disaster images

### Flutter Integration

```dart
// Example API call from Flutter
final response = await http.post(
  Uri.parse('http://10.0.2.2:5000/api/report/create'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'title': 'Flood in Area',
    'description': 'Heavy flooding observed',
    'location': {'latitude': 28.6139, 'longitude': 77.2090},
    'category': 'flood',
    'reportedBy': 'user123'
  }),
);
```

### MongoDB Setup

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Copy connection string to `.env` files

### Testing

Use Postman or curl to test endpoints:

```bash
# Test API Gateway
curl http://localhost:5000

# Test Auth
curl -X POST http://localhost:5002/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test Report Creation  
curl -X POST http://localhost:5001/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Report","description":"Test","location":{"latitude":28.6,"longitude":77.2},"category":"other","reportedBy":"test"}'
```

## 🔧 Development

- Each service runs independently
- MongoDB connection required for auth and report services
- AI service runs standalone with Flask
- Use environment variables for configuration

## 🚀 Deployment

Ready for deployment on:
- Railway
- Render  
- AWS Elastic Beanstalk
- Google Cloud Run

Update environment variables in production and ensure MongoDB Atlas is accessible.