# Multi-stage Dockerfile for Collaborative Code Studio
# Builds both frontend and backend into a single container

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Backend with UV
FROM python:3.12-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy backend files
COPY backend/ ./backend/

# Install backend dependencies using uv
WORKDIR /app/backend
RUN uv sync --frozen

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose port
EXPOSE 8000

RUN apt-get update && apt-get install -y libpq-dev

# Set environment variables
ENV DATABASE_URL=sqlite+aiosqlite:///./data/app.db
ENV PYTHONUNBUFFERED=1

# Create data directory for SQLite
RUN mkdir -p /app/data

# Run the application
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
