from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from fastapi.responses import HTMLResponse
import json
from app.services.recommendation import RecommendationService

router = APIRouter(tags=["recommendation"])

@router.get("/get_recommendation/{stationID}", response_class=HTMLResponse)
def get_recommendation(stationID: str = Path(..., description="The stationID to get recommendations for"),
                       n_recommendations: int = Query(5, gt=0, le=20, description="Number of recommendations to return")
                       ) -> Any:
    """
    Get recommendation list for user
    """
    try:
        recommendation_service = RecommendationService()
        
        # Add logging to see what's happening
        print(f"Attempting to get recommendations for station ID: {stationID}")
        
        recommendation_service.refresh_model()
        print("Model refreshed successfully")
        
        recommendation_list = recommendation_service.get_recommendations_for_user(stationID, n_recommendations=n_recommendations)
        print(f"Received {len(recommendation_list) if recommendation_list else 0} recommendations")
        
        return HTMLResponse(content=json.dumps(recommendation_list), status_code=200)
        
    except Exception as e:
        # Log the full error trace for debugging
        error_trace = traceback.format_exc()
        print(f"Error in get_recommendation: {error_trace}")
        
        # Return a more informative error
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")