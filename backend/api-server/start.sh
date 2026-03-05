#!/bin/sh
set -e

echo "[STARTUP] Running database migrations..."
npx prisma migrate deploy

echo "[STARTUP] Starting server..."
exec node src/server.js
