
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers import sessions, execution
from contextlib import asynccontextmanager
from database import engine
from tables import Base
import os
from pathlib import Path

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Collaborative Code Studio API",
    description="Backend for Collaborative Code Studio",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix="/api")
app.include_router(execution.router, prefix="/api")

@app.get("/api")
async def root():
    return {"message": "Collaborative Code Studio API is running"}

# Serve frontend static files (for Docker deployment)
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve index.html for all non-API routes
        if full_path and not full_path.startswith("api"):
            file_path = frontend_dist / full_path
            if file_path.is_file():
                return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
