#!/bin/bash
set -e

echo "=== Kids Chore App Deployment ==="

npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
npm run build

# Copy static files for standalone
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Create logs directory
mkdir -p logs

# Restart PM2
pm2 restart kids-chore-app || pm2 start ecosystem.config.js

echo "=== Deployment Complete ==="
