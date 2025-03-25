from fastapi import FastAPI
from api import router  # Fixed import path
from core.config import settings  # Fixed import path
from core.middleware import setup_middlewares  # Fixed import path

def create_application() -> FastAPI:
    """Create and configure the FastAPI application"""

    application = FastAPI(
        title=settings.PROJECT_NAME,
        debug=settings.DEBUG,
    )

    # Set up middlewares
    setup_middlewares(application)

    # Include API routes
    application.include_router(router, prefix="")

    return application

app = create_application()
