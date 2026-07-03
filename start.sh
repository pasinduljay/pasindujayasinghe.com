#!/bin/sh
echo "Waiting for database to be ready..."
# Simple wait loop doesn't check TCP connectivity, but `npx prisma db push` will retry or fail.
# Since we use restart: always in compose, if this fails, it restarts.

# Set NODE_PATH so seed script can find bcryptjs
export NODE_PATH=/app/admin-tools/node_modules

echo "Running database migrations..."
# Using --accept-data-loss since we are in dev/prototype mode and might have wiped volumes.
# Retrying until database is ready
max_retries=30
count=0
until /app/admin-tools/node_modules/.bin/prisma db push --accept-data-loss --skip-generate; do
  echo "Prisma db push failed, retrying in 2 seconds... ($count/$max_retries)"
  sleep 2
  count=$((count+1))
  if [ $count -ge $max_retries ]; then
    echo "Timeout waiting for database"
    exit 1
  fi
done

echo "Seeding database..."
node prisma/seed.js

echo "Starting application..."
exec node server.js
