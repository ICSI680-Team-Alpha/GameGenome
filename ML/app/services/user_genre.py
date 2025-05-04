# app/services/user_genre.py

import pandas as pd
from typing import List, Dict, Any
from app.core.db import MongoDBSingleton
from app.core.config import settings
from app.services.genre_vectorizer import GenreVectorizer
from app.services.quiz import quizService


class UserGenre:    
    def __init__(self, stationID: Any):
        self.rating = None
        self.modified_rating = None
        self.load_ratings(stationID)
        self.modify_rating(stationID)

    def load_ratings(self, stationID: int, collection_name: str = "game_feedback") -> bool:
        """Load user ratings from the database."""
        mongo = MongoDBSingleton()
        database = mongo.get_database(settings.DB_NAME)
        collection = database[collection_name]

        user_preference = collection.find_one({"StationID": stationID})
        if user_preference is None:
            ## TODO suppose to raise an exception, but for now just print the error message and return use default ratings
            user_preference = collection.find_one({"StationID": 1})

        self.rating = user_preference.get("rating", None)
        if self.rating is None:
            ## TODO suppose to raise an exception, but for now just print the error message and return use default ratings
            user_preference = collection.find_one({"StationID": 1})
            self.rating = user_preference.get("rating", None)
            if self.rating is None:
                print(f"Error: No user preference data available for StationID: 1")
                return False
            # TODO return None

        return True
    
    def modify_rating(self, stationID: Any) -> bool:
        """Modify the user's quiz response based on their quiz responses."""
        quiz_service = quizService(stationID)
        self.modified_rating = quiz_service.add_rating(self.rating)
        print(f"rating modified")
        return True
    
    def get_user_column_vector(self) -> Dict[int, Dict[str, int]]:
        """Get and cache game genres."""
        genre_vectorizer_service = GenreVectorizer()\
        ## TODO enable/disable the user quiz impact by changing the parameter to self.rating/self.modified_rating
        ## TODO  and comments the self.modify_rating(stationID) in the constructor
        user_vector = genre_vectorizer_service.vectorize_user_preference(self.modified_rating)
        print(f"User feature vectorized")
        ## TODO add quiz impact to user_vector
        return user_vector
    
    def get_rated_geme_list(self) -> List[int]:
        if self.rating is None:
            print("Error: No rating data available. Call load_ratings first.")
            return []
        
        # extract AppID from user
        # if unsuccessful, raise an exception
        try:
            return [int(rating.get("AppID")) for rating in self.rating]
            print(f"Rated game list: {rated_game_list}")
        except ValueError as e:
            raise ValueError(f"Invalid game ID in rating data: {e}")