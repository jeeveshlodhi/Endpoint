from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
import time
from typing import Dict, Any, Optional

from starlette.requests import Request

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
    timeout: Optional[int] = 30

class ApiResponse(BaseModel):
    status_code: int
    headers: Dict[str, str]
    content: str
    execution_time_ms: float
    size_bytes: int
    request_details: Dict[str, Any]

@app.post("/api/fetch", response_model=ApiResponse)
async def fetch_url(request_data: UrlRequest = Body(...)):
    try:
        print(request_data)
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
                request_details=request_details
            )

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timed out")
    except httpx.RequestError as e:
        raise HTTPException(status_code=400, detail=f"Request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
