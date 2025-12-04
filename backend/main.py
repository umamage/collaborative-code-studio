from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sessions, execution

app = FastAPI(
    title="Collaborative Code Studio API",
    description="Backend for Collaborative Code Studio",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(execution.router)

@app.get("/")
async def root():
    return {"message": "Collaborative Code Studio API is running"}
