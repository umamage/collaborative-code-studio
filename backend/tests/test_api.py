
import pytest
from fastapi.testclient import TestClient
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import get_db
from tables import Base

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    # Create tables
    import asyncio
    async def init_models():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    
    asyncio.run(init_models())
    
    with TestClient(app) as c:
        yield c

@pytest.fixture
def session_id(client):
    response = client.post("/sessions", json={"hostName": "Alice", "language": "python"})
    assert response.status_code == 201
    return response.json()["id"]


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Collaborative Code Studio API is running"}

def test_create_session(client):
    response = client.post("/sessions", json={"hostName": "TestHost", "language": "python"})
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["language"] == "python"
    assert len(data["participants"]) == 1
    assert data["participants"][0]["name"] == "TestHost"
    assert data["participants"][0]["isHost"] == True

def test_get_session(client, session_id):
    response = client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id

def test_get_nonexistent_session(client):
    response = client.get("/sessions/nonexistent")
    assert response.status_code == 404

def test_join_session(client, session_id):
    response = client.post(f"/sessions/{session_id}/join", json={"participantName": "NewUser"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["participants"]) == 2
    assert data["participants"][1]["name"] == "NewUser"

def test_join_nonexistent_session(client):
    response = client.post("/sessions/nonexistent/join", json={"participantName": "NewUser"})
    assert response.status_code == 404

def test_update_code(client, session_id):
    new_code = "print('Updated Code')"
    response = client.put(f"/sessions/{session_id}/code", json={
        "sessionId": session_id,
        "code": new_code,
        "language": "python",
        "updatedBy": "TestHost"
    })
    assert response.status_code == 200
    
    # Verify update
    get_response = client.get(f"/sessions/{session_id}")
    assert get_response.json()["code"] == new_code

def test_execute_code(client):
    code = "print('Hello')"
    response = client.post("/execute", json={"code": code, "language": "python"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "Mock Output" in data["output"]
