from fastapi.testclient import TestClient
import sys
import os
import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

def test_collaboration_scenario(client):
    # 1. Host creates a session
    host_response = client.post("/sessions", json={"hostName": "HostUser", "language": "python"})
    assert host_response.status_code == 201
    session_data = host_response.json()
    session_id = session_data["id"]
    assert session_data["participants"][0]["name"] == "HostUser"
    
    # 2. Participant joins the session
    join_response = client.post(f"/sessions/{session_id}/join", json={"participantName": "GuestUser"})
    assert join_response.status_code == 200
    session_data = join_response.json()
    assert len(session_data["participants"]) == 2
    assert session_data["participants"][1]["name"] == "GuestUser"
    
    # 3. Host updates the code
    new_code = "print('Hello from Host')"
    update_response = client.put(f"/sessions/{session_id}/code", json={
        "sessionId": session_id,
        "code": new_code,
        "language": "python",
        "updatedBy": "HostUser"
    })
    assert update_response.status_code == 200
    
    # 4. Participant sees the updated code
    get_response = client.get(f"/sessions/{session_id}")
    assert get_response.status_code == 200
    session_data = get_response.json()
    assert session_data["code"] == new_code
    
    # 5. Participant executes the code
    exec_response = client.post("/execute", json={
        "code": session_data["code"],
        "language": session_data["language"]
    })
    assert exec_response.status_code == 200
    exec_data = exec_response.json()
    assert exec_data["success"] == True
    assert "Mock Output" in exec_data["output"]
