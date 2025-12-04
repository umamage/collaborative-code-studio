from fastapi import APIRouter, HTTPException
from models import Session, CreateSessionRequest, JoinSessionRequest, CodeUpdate
import database

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.post("", response_model=Session, status_code=201)
async def create_session(request: CreateSessionRequest):
    return database.create_session(request.hostName, request.language)

@router.get("/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session = database.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/{session_id}/join", response_model=Session)
async def join_session(session_id: str, request: JoinSessionRequest):
    session = database.join_session(session_id, request.participantName)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.put("/{session_id}/code")
async def update_code(session_id: str, update: CodeUpdate):
    session = database.update_code(session_id, update.code, update.language)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Code updated successfully"}
