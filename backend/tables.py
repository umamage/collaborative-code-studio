from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, DeclarativeBase
from datetime import datetime
import uuid

class Base(DeclarativeBase):
    pass

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    language = Column(String, default="javascript")
    code = Column(Text, default="")
    
    participants = relationship("Participant", back_populates="session", cascade="all, delete-orphan")

class Participant(Base):
    __tablename__ = "participants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())[:8])
    name = Column(String)
    is_host = Column(String) # Storing boolean as string 'true'/'false' or just use Boolean if supported by all DBs easily. Let's use Boolean.
    # Actually, let's use Boolean. SQLAlchemy handles it.
    from sqlalchemy import Boolean
    isHost = Column(Boolean, default=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String, ForeignKey("sessions.id"))

    session = relationship("Session", back_populates="participants")
