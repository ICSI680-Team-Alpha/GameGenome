# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from app.api.main import api_router

from app.services.recommendation import RecommendationService

recommendation_service = RecommendationService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to handle startup and shutdown events
    """
    # Startup event
    try:
        print("Loading recommendation model...")
        recommendation_service.refresh_model()
        print("Recommendation model loaded successfully")
    except Exception as e:
        print(f"Error loading recommendation model: {e}")
    
    yield

app = FastAPI(
    title="Recommendation API",
    description="API for recommendation system",
    version="1.1.3",
    openapi_url="/api/v1/openapi.json",
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

