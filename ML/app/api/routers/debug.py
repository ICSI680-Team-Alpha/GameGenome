from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
import os

router = APIRouter(tags=["debug"])

@router.get("/debug/settings")
async def debug_settings():
    """Debug endpoint to check settings values."""
    # Return only non-sensitive settings
    return {
        "cwd": os.getcwd(),
        "API_V1_STR": settings.API_V1_STR,
        "FRONTEND_HOST": settings.FRONTEND_HOST,
        "ENVIRONMENT": settings.ENVIRONMENT,
        "DB_NAME": settings.DB_NAME,
        "DB_USERNAME": settings.DB_USERNAME,
        # Password is intentionally excluded
        "RECOMMENDATION_API_PREFIX": settings.RECOMMENDATION_API_PREFIX,
        "all_cors_origins": settings.all_cors_origins,
        # Check if connection string works by showing partially masked version
        "MONGODB_CONNECTION_STRING_VALID": settings.DB_CONNECTION_STRING.startswith("mongodb+srv://")
    }