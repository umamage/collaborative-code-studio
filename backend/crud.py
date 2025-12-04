from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from tables import Session, Participant
from models import CodeUpdate
import uuid
from datetime import datetime, timezone

def get_default_code(language: str) -> str:
    templates = {
        "javascript": "// Welcome to the coding interview!\n// Write your solution below.\n\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n\n// Test your solution\nconsole.log(solution(\"Hello, World!\"));\n",
        "typescript": "// Welcome to the coding interview!\n// Write your solution below.\n\nfunction solution(input: string): string {\n  // Your code here\n  return input;\n}\n\n// Test your solution\nconsole.log(solution(\"Hello, World!\"));\n",
        "python": "# Welcome to the coding interview!\n# Write your solution below.\n\ndef solution(input):\n    # Your code here\n    return input\n\n# Test your solution\nprint(solution(\"Hello, World!\"))\n",
        "java": "// Welcome to the coding interview!\n// Write your solution below.\n\npublic class Solution {\n    public static String solution(String input) {\n        // Your code here\n        return input;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(solution(\"Hello, World!\"));\n    }\n}\n",
        "cpp": "// Welcome to the coding interview!\n// Write your solution below.\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring solution(string input) {\n    // Your code here\n    return input;\n}\n\nint main() {\n    cout << solution(\"Hello, World!\") << endl;\n    return 0;\n}\n",
    }
    return templates.get(language, templates["javascript"])

async def create_session(db: AsyncSession, host_name: str, language: str = "javascript") -> Session:
    session_id = str(uuid.uuid4())[:8]
    db_session = Session(
        id=session_id,
        language=language,
        code=get_default_code(language),
        created_at=datetime.now(timezone.utc)
    )
    
    host_participant = Participant(
        id=str(uuid.uuid4())[:8],
        name=host_name,
        isHost=True,
        joined_at=datetime.now(timezone.utc),
        session=db_session
    )
    
    db.add(db_session)
    # Participant is added via relationship cascade or explicitly
    # db.add(host_participant) # relationship handles this if we append, but here we set session=db_session
    
    await db.commit()
    await db.refresh(db_session)
    # Refresh to get participants
    result = await db.execute(select(Session).options(selectinload(Session.participants)).where(Session.id == session_id))
    return result.scalars().first()

async def get_session(db: AsyncSession, session_id: str) -> Session | None:
    result = await db.execute(select(Session).options(selectinload(Session.participants)).where(Session.id == session_id))
    return result.scalars().first()

async def join_session(db: AsyncSession, session_id: str, participant_name: str) -> Session | None:
    session = await get_session(db, session_id)
    if not session:
        return None
        
    new_participant = Participant(
        id=str(uuid.uuid4())[:8],
        name=participant_name,
        isHost=False,
        joined_at=datetime.now(timezone.utc),
        session_id=session_id
    )
    
    db.add(new_participant)
    await db.commit()
    await db.refresh(session)
    return session

async def update_code(db: AsyncSession, update: CodeUpdate) -> None:
    session = await get_session(db, update.sessionId)
    if session:
        session.code = update.code
        session.language = update.language
        await db.commit()
