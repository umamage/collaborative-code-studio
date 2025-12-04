from typing import Dict, Optional
from models import Session, Participant
from datetime import datetime
# from nanoid import nanoid 
# Wait, I didn't install nanoid. I should use uuid or install nanoid. 
# The frontend uses nanoid. I'll use uuid for now to avoid extra dependencies if possible, or just install nanoid.
# Let's check if nanoid is available or just use uuid short.
# Actually, I'll use a simple helper for ID generation to match frontend style if needed, but UUID is fine.
# Let's use `uuid` and take a substring for short IDs.

import uuid

def generate_id(length=10):
    return str(uuid.uuid4()).replace('-', '')[:length]

# In-memory storage
sessions: Dict[str, Session] = {}

def create_session(host_name: str, language: str) -> Session:
    session_id = generate_id()
    host = Participant(
        id=generate_id(8),
        name=host_name,
        isHost=True,
        joinedAt=datetime.now()
    )
    session = Session(
        id=session_id,
        createdAt=datetime.now(),
        language=language,
        code=get_default_code(language),
        participants=[host]
    )
    sessions[session_id] = session
    return session

def get_session(session_id: str) -> Optional[Session]:
    return sessions.get(session_id)

def join_session(session_id: str, participant_name: str) -> Optional[Session]:
    session = sessions.get(session_id)
    if not session:
        return None
    
    participant = Participant(
        id=generate_id(8),
        name=participant_name,
        isHost=False,
        joinedAt=datetime.now()
    )
    session.participants.append(participant)
    return session

def update_code(session_id: str, code: str, language: str) -> Optional[Session]:
    session = sessions.get(session_id)
    if session:
        session.code = code
        session.language = language
    return session

def get_default_code(language: str) -> str:
    # Simplified default code for now
    return f"// Start coding in {language}"
