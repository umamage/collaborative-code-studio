from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class Participant(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: str
    name: str
    isHost: bool
    joinedAt: datetime = Field(validation_alias="joined_at")

class Session(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: str
    createdAt: datetime = Field(validation_alias="created_at")
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
