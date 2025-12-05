from fastapi import APIRouter, HTTPException, Depends
from models import CreateSessionRequest, JoinSessionRequest, CodeUpdate, Session as SessionModel
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
import crud

router = APIRouter()

import logging

logger = logging.getLogger(__name__)

@router.post("/sessions", response_model=SessionModel, status_code=201)
async def create_session(request: CreateSessionRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await crud.create_session(db, request.hostName, request.language)
    except Exception as e:
        logger.error(f"Error creating session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/sessions/{session_id}", response_model=SessionModel)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)):
    session = await crud.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/join", response_model=SessionModel)
async def join_session(session_id: str, request: JoinSessionRequest, db: AsyncSession = Depends(get_db)):
    session = await crud.join_session(db, session_id, request.participantName)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.put("/sessions/{session_id}/code")
async def update_code(session_id: str, update: CodeUpdate, db: AsyncSession = Depends(get_db)):
    if session_id != update.sessionId:
        raise HTTPException(status_code=400, detail="Session ID mismatch")
    await crud.update_code(db, update)
    return {"status": "success"}
