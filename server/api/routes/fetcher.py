from fastapi import APIRouter, Body
from models.schemas import UrlRequest, ApiResponse
from services.http_client import execute_request

router = APIRouter()

@router.post("/fetch", response_model=ApiResponse)
async def fetch_url(request_data: UrlRequest = Body(...)):
    """
    Fetch data from the provided URL with the given parameters.

    This endpoint acts as a proxy to fetch data from external APIs.
    """
    return await execute_request(request_data)
