from fastapi import APIRouter
from models.schemas import ApiResponse
import psutil
import time

router = APIRouter()

@router.get("/health", response_model=ApiResponse)
async def health_check():
    """
    Check the health of the server.
    """
    start_time = time.time()  # Track execution time

    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    disk_usage = psutil.disk_usage("/")

    execution_time = (time.time() - start_time) * 1000  # Convert to ms

    health_data = {
        "status": "healthy",
        "cpu_usage": f"{cpu_usage}%",
        "memory_usage": f"{memory_info.percent}%",
        "disk_usage": f"{disk_usage.percent}%"
    }

    return ApiResponse(
        success=True,
        message="Server is healthy",
        data=health_data,
        status_code=200,
        headers={},
        content='',
        execution_time_ms=execution_time,
        size_bytes=len(str(health_data).encode("utf-8")),
        request_details={}
    )
