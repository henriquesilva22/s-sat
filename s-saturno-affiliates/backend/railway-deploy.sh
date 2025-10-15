#!/bin/bash
# Railway deployment script

echo "🚀 Starting S-Saturno Backend Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed database if needed
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seed failed or not needed"

echo "✅ Deployment complete!"