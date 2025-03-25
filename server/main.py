from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
import time
from typing import Dict, Any, Optional

app = FastAPI(title="URL Fetcher API")

# Add CORS middleware to allow frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: HttpUrl
    method: str = "GET"
    headers: Optional[Dict[str, str]] = None
    params: Optional[Dict[str, str]] = None
    body: Optional[Any] = None
    timeout: Optional[float] = 30.0

class ErrorDetails(BaseModel):
    error_type: str
    message: str
    status_code: int

class ApiResponse(BaseModel):
    status_code: int
    headers: Dict[str, str]
    content: str
    execution_time_ms: float
    size_bytes: int
    request_details: Dict[str, Any]
    error: Optional[ErrorDetails] = None
    success: bool = True

@app.post("/api/fetch", response_model=ApiResponse)
async def fetch_url(request_data: UrlRequest = Body(...)):
    start_time = time.time()

    # Convert headers to proper format
    headers = request_data.headers or {}

    # Prepare request details for logging
    request_details = {
        "method": request_data.method,
        "url": str(request_data.url),
        "headers": headers,
        "params": request_data.params,
        "body": request_data.body,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=request_data.method,
                url=str(request_data.url),
                headers=headers,
                params=request_data.params,
                json=request_data.body if request_data.method not in ["GET", "HEAD"] else None,
                timeout=request_data.timeout
            )

            # Calculate metrics
            end_time = time.time()
            execution_time = (end_time - start_time) * 1000  # Convert to milliseconds
            content_size = len(response.content)

            # Convert headers to dict (they might be in a different format)
            response_headers = dict(response.headers.items())

            return ApiResponse(
                status_code=response.status_code,
                headers=response_headers,
                content=response.text,
                execution_time_ms=execution_time,
                size_bytes=content_size,
                request_details=request_details,
                success=True,
                error=None
            )

    except httpx.TimeoutException as e:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000

        error_details = ErrorDetails(
            error_type="TimeoutException",
            message=f"Request timed out after {request_data.timeout} seconds: {str(e)}",
            status_code=504
        )

        return ApiResponse(
            status_code=504,
            headers={},
            content="",
            execution_time_ms=execution_time,
            size_bytes=0,
            request_details=request_details,
            success=False,
            error=error_details
        )

    except httpx.HTTPStatusError as e:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000

        # Include response details even though it's an error
        error_details = ErrorDetails(
            error_type="HTTPStatusError",
            message=f"HTTP Status Error: {str(e)}",
            status_code=e.response.status_code
        )

        return ApiResponse(
            status_code=e.response.status_code,
            headers=dict(e.response.headers.items()),
            content=e.response.text,
            execution_time_ms=execution_time,
            size_bytes=len(e.response.content),
            request_details=request_details,
            success=False,
            error=error_details
        )

    except httpx.RequestError as e:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000

        error_details = ErrorDetails(
            error_type="RequestError",
            message=f"Request error: {str(e)}",
            status_code=400
        )

        return ApiResponse(
            status_code=400,
            headers={},
            content="",
            execution_time_ms=execution_time,
            size_bytes=0,
            request_details=request_details,
            success=False,
            error=error_details
        )

    except Exception as e:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000

        error_details = ErrorDetails(
            error_type=type(e).__name__,
            message=f"Internal server error: {str(e)}",
            status_code=500
        )

        return ApiResponse(
            status_code=500,
            headers={},
            content="",
            execution_time_ms=execution_time,
            size_bytes=0,
            request_details=request_details,
            success=False,
            error=error_details
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
