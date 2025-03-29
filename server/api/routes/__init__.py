from fastapi import APIRouter
from api.routes.fetcher import router as fetcher_router
from api.routes.health_check import router as health_check_router
from api.routes.test import router as test_router

router = APIRouter()

router.include_router(fetcher_router, tags=["fetcher"])
router.include_router(health_check_router, tags=["health_check"])
router.include_router(test_router, tags=["test"])
