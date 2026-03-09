#!/bin/bash

echo "🚀 Starting Notes App..."

# ── Verificar dependencias ────────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker and try again."
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js and try again."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed. Please install npm and try again."
  exit 1
fi

# ── Base de datos ─────────────────────────────────────────────────────────────
echo "🐘 Starting PostgreSQL with Docker..."

docker run -d \
  --name notes-db \
  -e POSTGRES_USER=user_notes \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=db_notes \
  -p 5432:5432 \
  postgres:15 2>/dev/null || echo "ℹ️  notes-db container already exists, skipping..."

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# ── Backend ───────────────────────────────────────────────────────────────────
echo "⚙️  Setting up backend..."
cd backend

if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user_notes
DB_PASSWORD=root
DB_DATABASE=db_notes
EOF
fi

npm install --legacy-peer-deps
npm run start:dev &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:3000 (PID: $BACKEND_PID)"

cd ..

# ── Frontend ──────────────────────────────────────────────────────────────────
echo "🎨 Setting up frontend..."
cd frontend

npm install
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"

cd ..

# ── Listo ─────────────────────────────────────────────────────────────────────
echo ""
echo "✨ Notes App is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services."

trap "echo '🛑 Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker stop notes-db 2>/dev/null; exit 0" SIGINT SIGTERM
wait
