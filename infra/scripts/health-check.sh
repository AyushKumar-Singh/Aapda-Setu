#!/bin/bash
# Health check script for all Aapda Setu services

echo "🏥 Checking Aapda Setu Services Health..."
echo "==========================================="

# Check MongoDB
echo -n "MongoDB:        "
if curl -s --max-time 5 http://localhost:27017 > /dev/null 2>&1; then
    echo "✓ Running"
else
    echo "✗ Not responding"
fi

# Check Redis
echo -n "Redis:          "
if redis-cli -h localhost ping > /dev/null 2>&1; then
    echo "✓ Running"
else
    echo "✗ Not responding"
fi

# Check API Gateway
echo -n "API Gateway:    "
response=$(curl -s --max-time 5 http://localhost:5000/health)
if echo "$response" | grep -q "ok"; then
    echo "✓ Running"
else
    echo "✗ Not responding"
fi

# Check ML CPU Service
echo -n "ML CPU:         "
response=$(curl -s --max-time 5 http://localhost:8000/health)
if echo "$response" | grep -q "healthy"; then
    echo "✓ Running"
else
    echo "✗ Not responding"
fi

# Check ML GPU Service
echo -n "ML GPU:         "
response=$(curl -s --max-time 5 http://localhost:8001/health)
if echo "$response" | grep -q "healthy"; then
    echo "✓ Running"
else
    echo "✗ Not responding"
fi

# Check Admin Dashboard
echo -n "Admin Dashboard:"
if curl -s --max-time 5 http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Running"
else
    echo "✗ Not responding"
fi

echo "==========================================="
echo "Health check complete!"
