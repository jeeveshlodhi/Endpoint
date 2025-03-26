from fastapi import FastAPI, Body, Header, File, UploadFile, HTTPException, Response, Cookie, Form
from fastapi.responses import JSONResponse, HTMLResponse, PlainTextResponse, StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from fastapi import APIRouter
import io
import time
import json

router = APIRouter()

# Basic models for request/response
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None
    tags: List[str] = []

class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

# Basic GET endpoints
@router.get("/")
async def root():
    return {"message": "Welcome to the API Tester Routes"}

@router.get("/items")
async def get_items():
    return [
        {"id": 1, "name": "Item 1"},
        {"id": 2, "name": "Item 2"},
        {"id": 3, "name": "Item 3"}
    ]

# GET with path parameters
@router.get("/items/{item_id}")
async def get_item(item_id: int):
    if item_id == 404:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item_id, "name": f"Item {item_id}"}

# GET with query parameters
@router.get("/search")
async def search_items(q: str, limit: int = 10, skip: int = 0):
    return {
        "query": q,
        "limit": limit,
        "skip": skip,
        "results": [f"Result {i}" for i in range(min(limit, 20))]
    }

# POST endpoints with JSON body
@router.post("/items")
async def create_item(item: Item):
    return {"item": item, "id": 1001}

# PUT endpoint
@router.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "updated_item": item}

# DELETE endpoint
@router.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"deleted": True, "item_id": item_id}

# PATCH endpoint
@router.patch("/items/{item_id}")
async def partial_update(item_id: int, item: Dict[str, Any] = Body(...)):
    return {"item_id": item_id, "patched_fields": item}

# Form data handling
@router.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username, "logged_in": True}

# File upload
@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(contents)
    }

# Multiple file uploads
@router.post("/upload-multiple")
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    return [
        {
            "filename": file.filename,
            "content_type": file.content_type,
        }
        for file in files
    ]

# Different response types
@router.get("/html", response_class=HTMLResponse)
async def get_html():
    return """
    <html>
        <head>
            <title>HTML Response</title>
        </head>
        <body>
            <h1>HTML Response Example</h1>
            <p>This is an HTML response from the API</p>
        </body>
    </html>
    """

@router.get("/text", response_class=PlainTextResponse)
async def get_text():
    return "This is a plain text response"

# Streaming response
@router.get("/stream")
async def get_stream():
    def generate():
        for i in range(10):
            yield f"data: {json.dumps({'count': i})}\n\n"
            time.sleep(0.5)
    return StreamingResponse(generate(), media_type="text/event-stream")

# File download
@router.get("/download")
async def download_file():
    content = "This is a sample file for download testing"
    stream = io.BytesIO(content.encode())

    return StreamingResponse(
        stream,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=sample.txt"}
    )

# Headers, cookies, and authentication tests
@router.get("/headers")
async def get_headers(user_agent: Optional[str] = Header(None)):
    return {"User-Agent": user_agent}

@router.get("/custom-header")
async def custom_header_response():
    content = {"message": "Custom header response"}
    headers = {"X-Custom-Header": "custom-value", "X-API-Key": "test-api-key"}
    return JSONResponse(content=content, headers=headers)

@router.get("/cookies")
async def get_cookies(test_cookie: Optional[str] = Cookie(None)):
    return {"test_cookie": test_cookie}

@router.post("/set-cookie")
async def set_cookie():
    response = JSONResponse(content={"message": "Cookie set"})
    response.set_cookie(key="test_cookie", value="cookie_value")
    return response

# Authentication simulation
@router.get("/auth")
async def auth_required(authorization: str = Header(...)):
    if authorization != "Bearer test-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"authorized": True}

# Status codes
@router.get("/status/{status_code}")
async def status_code(status_code: int):
    return Response(status_code=status_code, content=f"Response with status code {status_code}")

# Delayed response for timeout testing
@router.get("/delay/{seconds}")
async def delayed_response(seconds: int):
    if seconds > 10:
        seconds = 10  # Cap at 10 seconds for safety
    time.sleep(seconds)
    return {"message": f"Response after {seconds} seconds delay"}

# Redirects
@router.get("/redirect")
async def redirect():
    return JSONResponse(
        status_code=302,
        content={"message": "Redirected"},
        headers={"Location": "/items"}
    )
