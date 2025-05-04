from fastapi import APIRouter

from app.api.routers import recommendation, debug

api_router = APIRouter()
api_router.include_router(recommendation.router)
api_router.include_router(debug.router)