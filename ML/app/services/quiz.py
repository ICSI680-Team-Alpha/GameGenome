# app/services/quiz.py

import pandas as pd
from typing import List, Dict, Any
from app.core.db import MongoDBSingleton
from app.core.config import settings

class quizService:
    def __init__(self, stationID):
        self.responses = None  # Initialize as None
        self.load_ratings(stationID)
        

    def load_ratings(self, stationID: int, db_name: str = settings.DB_NAME, collection_name: str = "quizResponses") -> bool:
        """Load user quiz responses from the database."""
        mongo = MongoDBSingleton()
        database = mongo.get_database(db_name)
        collection = database[collection_name]

        quiz_response = collection.find_one({"stationID": stationID})
        if quiz_response is None:
            ## TODO The behavior may change based on backend design. For now, just load the default user quiz response
            # If the user quiz response is not found, load the default user quiz response
            quiz_response = collection.find_one({"stationID": "1746305091322"})
            if quiz_response is None:
                self.responses = None
                return False

        self.responses = quiz_response.get("responses", None)  # Get the responses array from quiz_response
        return True
    
    def add_rating(self, original_rating: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Modify the user's rating based on their quiz responses.
        
        Args:
            original_rating: The user's original rating data
            
        Returns:
            modified_rating: The modified rating list with additional weighted games
        """
        if self.responses is None:
            print("Error: No quiz response data available. Call load_ratings first.")
            return original_rating
        
        modified_rating = original_rating.copy()
        
        # Process each quiz response
        for response in self.responses:
            quiz_id = response.get('quizID')
            question_type = response.get('questionType')
            selection = response.get('selection', [])
            
            # Handle different quiz types
            if quiz_id == 1 and question_type == 'multiSelect':
                # Direct game selections
                additional_games = self._process_game_selections(selection)
                modified_rating.extend(additional_games)
            
            elif quiz_id == 2 and question_type == 'multiSelect':
                # Genre preferences
                additional_games = self._process_genre_preferences(selection)
                modified_rating.extend(additional_games)
            
            elif quiz_id == 3 and question_type == 'multiSelect':
                # Gameplay preferences  
                additional_games = self._process_gameplay_preferences(selection)
                modified_rating.extend(additional_games)
            
            elif quiz_id == 4 and question_type == 'multiSelect':
                # Gaming goals/difficulty preferences
                additional_games = self._process_gaming_goals(selection)
                modified_rating.extend(additional_games)
        
        # Remove potential duplicates (keeping the latest rating for each game)
        modified_rating = self._remove_duplicate_ratings(modified_rating)
        
        return modified_rating
    
    def _process_game_selections(self, selected_games: List[str]) -> List[Dict[str, Any]]:
        """Process direct game selections from quiz."""
        additional_ratings = []
        
        for game_id in selected_games:
            additional_ratings.append({
                "AppID": int(game_id),
                "RatingType": "positive",
                "source": "quiz"  # Add source to track where the rating came from
            })
        
        return additional_ratings
    
    def _process_genre_preferences(self, selected_genres: List[str]) -> List[Dict[str, Any]]:
        """Process genre preferences and return additional game ratings."""
        additional_ratings = []
        
        # Query games database for games that match selected genres
        mongo = MongoDBSingleton()
        database = mongo.get_database(settings.DB_NAME)
        genre_collection = database["steam_genre"]
        
        for genre in selected_genres:
            # Convert genre name to appropriate field name (handle case sensitivity)
            genre_field = genre.lower()
            # Find games that have high values in selected genres
            query = {f"genre.{genre_field}": {"$gt": 50}}  # Threshold can be adjusted
            games = list(genre_collection.find(query).limit(5))  # Limit to prevent too many additions
            
            for game in games:
                additional_ratings.append({
                    "AppID": game["AppID"],
                    "RatingType": "positive",
                    "source": "quiz"  # Add source to track where the rating came from
                })
        
        return additional_ratings
    
    def _process_gameplay_preferences(self, selected_gameplay: List[str]) -> List[Dict[str, Any]]:
        """Process gameplay preferences and return additional game ratings."""
        additional_ratings = []
        mongo = MongoDBSingleton()
        database = mongo.get_database(settings.DB_NAME)
        genre_collection = database["steam_genre"]
        
        # Map gameplay preferences to genre tags
        gameplay_to_genre_map = {
            "Solo games": "singleplayer",
            "Multiplayer with friends": "co_op",
            "Competitive multiplayer": "competitive",
            "Open world exploration": "open_world"
        }
        
        for gameplay in selected_gameplay:
            if gameplay in gameplay_to_genre_map:
                genre_tag = gameplay_to_genre_map[gameplay]
                query = {f"genre.{genre_tag}": {"$gt": 50}}
                games = list(genre_collection.find(query).limit(3))
                
                for game in games:
                    additional_ratings.append({
                        "AppID": game["AppID"],
                        "RatingType": "positive",
                        "source": "quiz"
                    })
        
        return additional_ratings
    
    def _process_gaming_goals(self, selected_goals: List[str]) -> List[Dict[str, Any]]:
        """Process gaming goals and return additional game ratings."""
        additional_ratings = []
        mongo = MongoDBSingleton()
        database = mongo.get_database(settings.DB_NAME)
        genre_collection = database["steam_genre"]
        
        # Map goals to genre tags
        goals_to_genre_map = {
            "Competition and achievement": ["competitive", "difficult"],
            "Relaxation and entertainment": ["casual", "relaxing"],
            "Story and narrative": ["story_rich", "adventure"],
            "Creative expression": ["sandbox", "building"]
        }
        
        for goal in selected_goals:
            if goal in goals_to_genre_map:
                for genre_tag in goals_to_genre_map[goal]:
                    query = {f"genre.{genre_tag}": {"$gt": 30}}
                    games = list(genre_collection.find(query).limit(2))
                    
                    for game in games:
                        additional_ratings.append({
                            "AppID": game["AppID"],
                            "RatingType": "positive",
                            "source": "quiz"
                        })
        
        return additional_ratings
    
    def _remove_duplicate_ratings(self, ratings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate ratings, keeping the latest one for each AppID."""
        unique_ratings = {}
        
        for rating in ratings:
            app_id = rating["AppID"]
            if app_id not in unique_ratings:
                unique_ratings[app_id] = rating
            else:
                # If the rating is from quiz (more recent), replace the original
                if rating.get("source") == "quiz":
                    unique_ratings[app_id] = rating
        
        return list(unique_ratings.values())