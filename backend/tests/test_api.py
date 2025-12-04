import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

@pytest.fixture
def session_id():
    response = client.post("/sessions", json={"hostName": "Alice", "language": "python"})
    assert response.status_code == 201
    return response.json()["id"]

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Collaborative Code Studio API is running"}

def test_create_session():
    response = client.post("/sessions", json={"hostName": "Alice", "language": "python"})
    assert response.status_code == 201
    data = response.json()
    assert data["language"] == "python"
    assert len(data["participants"]) == 1
    assert data["participants"][0]["name"] == "Alice"
    assert "id" in data

def test_get_session(session_id):
    response = client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id

def test_join_session(session_id):
    response = client.post(f"/sessions/{session_id}/join", json={"participantName": "Bob"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["participants"]) == 2
    assert data["participants"][1]["name"] == "Bob"

def test_update_code(session_id):
    response = client.put(f"/sessions/{session_id}/code", json={
        "sessionId": session_id,
        "code": "print('Hello')",
        "language": "python",
        "updatedBy": "Alice"
    })
    assert response.status_code == 200
    
    # Verify update
    response = client.get(f"/sessions/{session_id}")
    data = response.json()
    assert data["code"] == "print('Hello')"

def test_execute_code():
    response = client.post("/execute", json={
        "code": "print('test')",
        "language": "python"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "Mock Output" in data["output"]
