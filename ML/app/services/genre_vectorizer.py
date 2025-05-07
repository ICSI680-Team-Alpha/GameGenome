# app/services/genre_vectorizer.py

import numpy as np
from typing import List, Dict, Any, Union
import pandas as pd


class GenreVectorizer:
    """
    Service for vectorizing game and user genre data.
    This class handles the transformation of raw genre data into feature vectors
    that can be used by the recommendation system.
    """
    
    def __init__(self):
        self.genre_list = None
    
    def vectorize_game(self, game_data: List[Dict[str, Any]]) -> np.ndarray:
        """
        Convert a game's genre data from Cursor into a feature vector.
        
        Args:
            game_data: Game data retrieved from database in Cursor format
            
        Returns:
            A numpy array representing the vectorized game genres
        """
        df = pd.DataFrame(game_data)
        
        if df is None or df.empty:
            print("Error: No genre data available")
            return None
        
        # Create a list to store each game's genre data
        all_genre_dicts = []
        
        # Process each game's genre data
        for i, row in df.iterrows():
            # Start with a dictionary of zeros for all genres
            game_dict = {genre: 0 for genre in row['genre'].keys()}
            # Fill in the actual values from the genre dictionary
            game_dict.update(row['genre'])
            # Add the AppID
            game_dict['AppID'] = row['AppID']
            # Add to our list
            all_genre_dicts.append(game_dict)
        
        # Create the DataFrame all at once (much more efficient)
        genre_matrix = pd.DataFrame(all_genre_dicts)
        
        return genre_matrix
    
    def build_game_feature_matrix(self, game_data) -> tuple:
        """
        Build a feature matrix for all games in the database.
        
        Returns:
            A tuple containing (game_ids, feature_matrix)
            - game_ids: List of game IDs
            - feature_matrix: Numpy array where each row corresponds to a game's feature vector
        """
        if game_data is None or game_data.empty:
            print("Error: No genre data available")
            return None, None
        # check game_data have AppID column
        if 'AppID' not in game_data.columns:
            print("Error: AppID column is missing")
            return None, None
        game_ids = game_data['AppID'].to_numpy()
        feature_matrix = game_data.drop(columns='AppID').to_numpy()
        return game_ids, feature_matrix
    
    def vectorize_user_preference(self, rating: list) -> np.ndarray:
        """
        Convert user preference data into a feature vector.
        
        Args:
            user_preference: User preference data from database
            
        Returns:
            A numpy array representing the vectorized user preferences
        """
        from app.services.game_genre import GameGenre
        game_genre_service = GameGenre()
        app_ids = list({int(r["AppID"]) for r in rating})
        df = game_genre_service.get_multiple_genres(app_ids)
        # Get the shape of the game feature matrix to ensure compatibility
        _, feature_shape = game_genre_service._feature_matrix.shape
        if isinstance(feature_shape, tuple):
            feature_dim = feature_shape[1]  # If _feature_matrix.shape returns (n_games, n_features)
        else:
            feature_dim = feature_shape
        user_vector = np.zeros(feature_dim)
        # Create a mapping from AppID to DataFrame row index for quick lookup
        app_id_to_index = {row['AppID']: i for i, row in df.iterrows()}
        
        # For each game the user interacted with, aggregate their preferences
        for game_rating in rating:
            # breakpoint()
            app_id = game_rating.get('AppID')
            rating_type = game_rating.get('RatingType')
            
            # Convert rating type to numeric value
            rating_value = 1.0 if rating_type == 'positive' else -1.0 if rating_type == 'negative' else 0.0
            
            if app_id:
                # Convert AppID to integer if it's stored as string
                app_id = int(app_id) if isinstance(app_id, str) else app_id
                
                # Find the game in the DataFrame
                if app_id in app_id_to_index:
                    idx = app_id_to_index[app_id]
                    # Get the game's genre vector (exclude AppID column)
                    game_row = df.iloc[idx]
                    game_vector = game_row.drop('AppID').values
                    
                    # Add weighted game vector to user preference vector
                    user_vector += game_vector * rating_value
        
        # If the user has no valid ratings, return None
        if np.all(user_vector == 0):
            print("Warning: User has no valid ratings for vectorization")
            return None
        
        # Normalize the user vector for cosine similarity
        user_vector = self.normalize_matrix(user_vector.reshape(1, -1))[0]
        user_vector = user_vector.reshape(1, -1)
        return user_vector
    
    def normalize_matrix(self, vectors: np.ndarray) -> np.ndarray:
        """
        Normalize feature vectors to have unit norm (for cosine similarity).
        
        Args:
            vectors: Input feature vectors
            
        Returns:
            Normalized feature vectors
        """
        # Avoid division by zero by adding a small epsilon to zero vectors
        norms = np.linalg.norm(vectors, axis=1)
        norms[norms == 0] = 1e-10
        
        # Normalize by dividing by the norm
        normalized_vectors = vectors / norms[:, np.newaxis]
        
        return normalized_vectors