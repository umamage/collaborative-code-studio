from fastapi import APIRouter
from models import ExecutionResult, ExecuteCodeRequest
import time

router = APIRouter(tags=["execution"])

@router.post("/execute", response_model=ExecutionResult)
async def execute_code(request: ExecuteCodeRequest):
    # Mock execution
    start_time = time.time()
    time.sleep(0.5) # Simulate delay
    
    output = f"[Mock Output] Executed {request.language} code.\nCode length: {len(request.code)}"
    
    return ExecutionResult(
        success=True,
        output=output,
        executionTime=time.time() - start_time
    )
