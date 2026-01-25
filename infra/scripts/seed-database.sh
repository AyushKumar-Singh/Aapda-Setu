#!/bin/bash
# Database seeding script for Aapda Setu

set -e

echo "🌱 Seeding Aapda Setu Database..."

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
until mongosh --host mongodb:27017 --eval "db.runCommand('ping').ok" --quiet; do
    sleep 2
done
echo "✓ MongoDB is ready"

# Run seed script
echo "Running seed script..."
docker exec aapda-api-gateway npx ts-node src/scripts/seed.ts

echo "✓ Database seeded successfully!"
