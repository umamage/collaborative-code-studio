# Collaborative Code Studio

A real-time collaborative coding platform with a React frontend and FastAPI backend.

## Prerequisites

- Node.js
- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (for Python dependency management)

## Installation

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   uv sync
   ```

3. **Install Root Dependencies**
   ```bash
   # From root directory
   npm install
   ```

## Running the Application

### Development Mode

To run both the frontend and backend servers simultaneously:

```bash
# From root directory
npm run dev
```

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Docker Deployment

To run the application in a Docker container:

```bash
# Build and run with docker-compose
docker-compose up -d

# Or build and run manually
docker build -t collaborative-code-studio .
docker run -p 8000:8000 -v app-data:/app/data collaborative-code-studio
```

- **Application**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

The Docker container includes both frontend and backend in a single image.

### Render Deployment

Deploy to Render with one click using the Blueprint:

```bash
# Push your code to GitHub
git push origin main
```

Then follow the [Render Deployment Guide](DEPLOY_RENDER.md) for detailed instructions.

Alternatively, use the Render button:
- Go to [Render Dashboard](https://dashboard.render.com)
- New → Blueprint
- Connect your GitHub repository
- Render auto-detects `render.yaml` and deploys

## Backend

The backend is built with FastAPI and uses `uv` for dependency management.

### Commands (in `backend/` directory)

- `make install`: Install dependencies
- `make run`: Run the server standalone
- `make test`: Run tests (Unit + Integration)

### API Specification

The OpenAPI specification is available at `backend/openapi.yaml`.

## Frontend

The frontend is built with React, Vite, and Tailwind CSS.

### Commands (in `frontend/` directory)

- `npm run dev`: Run the development server
- `npm run build`: Build for production

## Testing

Integration tests are included in the backend to verify the full collaboration flow.

```bash
cd backend
make test
```
