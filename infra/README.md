# Aapda Setu Infrastructure

This folder contains all Docker and infrastructure configuration files for deploying the complete Aapda Setu platform.

## Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| MongoDB | 27017 | Main database |
| Redis | 6379 | Cache & job queues |
| API Gateway | 5000 | Node.js backend API |
| ML CPU Service | 8000 | Text analysis (DistilBERT) |
| ML GPU Service | 8001 | Image analysis (EfficientNet) |
| Admin Dashboard | 3000 | Next.js frontend |

## Architecture

```
infra/
├── docker-compose.yml      # Main orchestration file
├── docker-compose.dev.yml  # Development overrides
├── docker-compose.prod.yml # Production overrides
├── dockerfiles/
│   ├── api-gateway.Dockerfile
│   ├── ml-cpu.Dockerfile
│   ├── ml-gpu.Dockerfile
│   └── admin-dashboard.Dockerfile
├── nginx/
│   └── nginx.conf          # Reverse proxy config
└── scripts/
    ├── seed-database.sh    # Database seeding
    └── health-check.sh     # Health check script
```

## Environment Variables

Copy `.env.example` to `.env` and configure:
- MongoDB connection
- Redis connection
- JWT secrets
- AWS S3 credentials (optional)
- Firebase config (optional)
