from pydantic import BaseModel, HttpUrl
from typing import Dict, Any, Optional

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
    message: str
    data: dict[str, Any]
    headers: Dict[str, str]
    content: str
    execution_time_ms: float
    size_bytes: int
    request_details: Dict[str, Any]
    error: Optional[ErrorDetails] = None
    success: bool = True
