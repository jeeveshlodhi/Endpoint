from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

def setup_middlewares(app: FastAPI) -> None:
    """Set up all necessary middleware for the application"""

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )

    # Here you can add additional middleware as needed
    # Such as authentication, request logging, etc.
