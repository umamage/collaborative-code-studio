from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Participant(BaseModel):
    id: str
    name: str
    isHost: bool
    joinedAt: datetime

class Session(BaseModel):
    id: str
    createdAt: datetime
    language: str
    code: str
    participants: List[Participant]

class CodeUpdate(BaseModel):
    sessionId: str
    code: str
    language: str
    updatedBy: str

class ExecutionResult(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    executionTime: float

class CreateSessionRequest(BaseModel):
    hostName: str
    language: str = "javascript"

class JoinSessionRequest(BaseModel):
    participantName: str

class ExecuteCodeRequest(BaseModel):
    code: str
    language: str
