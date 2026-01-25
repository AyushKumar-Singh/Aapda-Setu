# API Gateway Documentation

## Base URL
`http://localhost:3000/api/v1`

## Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

Uses JWT tokens for both web admin dashboard and mobile app.

## Endpoints

### Authentication

#### Admin Login (JWT)
```
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@aapdasetu.in",
  "password": "your_password"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600,
    "user": { "user_id": "...", "name": "...", "role": "admin" }
  }
}
```

#### Mobile Phone Verify (Dev Mode)
```
POST /auth/mobile/verify
Content-Type: application/json

{
  "phone": "+911234567890",
  "name": "User Name"  // optional
}

Response:
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "expires_in": 2592000,
    "user": { "user_id": "...", "name": "...", "phone": "...", "role": "user" }
  }
}
```

### Reports

#### List Reports
```
GET /reports?status=pending&type=fire&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Report
```
POST /reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "fire",
  "severity": "high",
  "title": "Fire incident",
  "description": "...",
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760]
  },
  "address": {
    "formatted": "Mumbai, India",
    "city": "Mumbai",
    "state": "Maharashtra"
  }
}
```

#### Verify Report (Admin Only)
```
POST /reports/:id/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "verified",
  "note": "Verified after cross-checking"
}
```

### Alerts

#### List Alerts
```
GET /alerts?status=active&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Alert (Admin Only)
```
POST /admin/alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "fire",
  "severity": "critical",
  "title": "Fire Alert",
  "message": "Active fire situation in area",
  "center": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760]
  },
  "radius_km": 5,
  "priority": "critical"
}
```

### Users (Admin Only)

#### List Users
```
GET /admin/users?role=user&status=active&search=john&page=1&limit=20
Authorization: Bearer <token>
```

#### Update User
```
PUT /admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "verifier",
  "status": "active"
}
```

### Analytics (Admin Only)

#### Dashboard Stats
```
GET /admin/analytics
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "total_reports_today": 45,
    "pending_verification": 12,
    "active_alerts": 3,
    "total_users": 1250,
    "avg_response_time_min": 8,
    "verification_accuracy": 0.93
  }
}
```

#### Reports Trend
```
GET /admin/analytics/trend?days=7
Authorization: Bearer <token>
```

#### Disaster Type Distribution
```
GET /admin/analytics/disaster-types
Authorization: Bearer <token>
```

## Error Responses

```json
{
  "success": false,
  "error": "Error message"
}
```

Common status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
