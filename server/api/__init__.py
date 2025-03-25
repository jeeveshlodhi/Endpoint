from fastapi import APIRouter
from api.routes import router as api_router
from core.config import settings

router = APIRouter()
router.include_router(api_router, prefix=settings.API_PREFIX)
