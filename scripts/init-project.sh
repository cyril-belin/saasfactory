#!/bin/bash

# scripts/init-project.sh

echo "🏭 SaaS Template Factory V2 - Initialization Script"

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Setup environment variables if .env doesn't exist
if [ ! -f .env ]; then
  echo "📄 Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️  Please fill in the missing values in .env before continuing."
fi

# 3. Prisma setup
echo "💎 Running Prisma setup..."
npx prisma generate

echo "✅ Initialization complete!"
echo "🚀 Run 'npm run dev' to start local development."
