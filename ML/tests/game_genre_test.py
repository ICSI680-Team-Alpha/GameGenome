# tests/user_genre_test.py
import pytest
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock

from app.services.game_genre import GameGenre
from app.services.genre_vectorizer import GenreVectorizer


@pytest.fixture
def sample_genre_data():
    """Sample genre data from database"""
    return [
        {"AppID": 10, "genre": {"action": 1, "adventure": 0.8, "rpg": 0.5, "indie": 0.3}},
        {"AppID": 20, "genre": {"strategy": 1, "simulation": 0.7, "puzzle": 0.4}},
        {"AppID": 30, "genre": {"action": 0.6, "shooter": 1, "multiplayer": 0.9, "competitive": 0.5}},
        {"AppID": 40, "genre": {"horror": 0.9, "adventure": 0.6, "survival": 1}}
    ]


@pytest.fixture
def sample_vectorized_data():
    """Sample vectorized genre data"""
    return pd.DataFrame({
        "AppID": [10, 20, 30, 40],
        "action": [1, 0, 0.6, 0],
        "adventure": [0.8, 0, 0, 0.6],
        "rpg": [0.5, 0, 0, 0],
        "indie": [0.3, 0, 0, 0],
        "strategy": [0, 1, 0, 0],
        "simulation": [0, 0.7, 0, 0],
        "puzzle": [0, 0.4, 0, 0],
        "shooter": [0, 0, 1, 0],
        "multiplayer": [0, 0, 0.9, 0],
        "competitive": [0, 0, 0.5, 0],
        "horror": [0, 0, 0, 0.9],
        "survival": [0, 0, 0, 1]
    })


@pytest.fixture
def sample_feature_matrix():
    """Sample feature matrix without AppID column"""
    return np.array([
        [1, 0.8, 0.5, 0.3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0.7, 0.4, 0, 0, 0, 0, 0],
        [0.6, 0, 0, 0, 0, 0, 0, 1, 0.9, 0.5, 0, 0],
        [0, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 1]
    ])


@pytest.fixture
def sample_normalized_matrix(sample_feature_matrix):
    """Sample normalized matrix"""
    norms = np.linalg.norm(sample_feature_matrix, axis=1)
    norms[norms == 0] = 1e-10  # Avoid division by zero
    return sample_feature_matrix / norms[:, np.newaxis]


class TestGameGenre:
    """Test class for GameGenre service"""
    
    def setup_method(self):
        """Reset singleton state before each test"""
        GameGenre._instance = None
        GameGenre._genre_cache = None
        GameGenre._game_ids = None
        GameGenre._feature_matrix = None
        GameGenre._normalized_matrix = None
    
    def test_singleton_pattern(self):
        """Test that GameGenre follows the singleton pattern"""
        # Mock get_genres to avoid actual DB calls
        with patch.object(GameGenre, 'get_genres') as mock_get_genres:
            mock_get_genres.return_value = (None, None, None, None)
            
            # First instance
            first_instance = GameGenre()
            
            # Second instance should be the same object
            second_instance = GameGenre()
            
            # Assert they are the same instance
            assert first_instance is second_instance
            
            # get_genres should only be called once during initialization
            mock_get_genres.assert_called_once()

    def test_get_genres(self, sample_genre_data, sample_vectorized_data, 
                      sample_feature_matrix, sample_normalized_matrix):
        """Test the get_genres method with mocked dependencies"""
        # Mock MongoDB
        mock_mongo = MagicMock()
        mock_collection = MagicMock()
        mock_db = {'steam_genre': mock_collection}
        mock_cursor = MagicMock()
        
        # Configure mocks
        mock_cursor.sort.return_value = sample_genre_data
        mock_collection.find.return_value = mock_cursor
        mock_mongo.get_database.return_value = mock_db
        
        # Patch dependencies
        with patch('app.services.game_genre.MongoDBSingleton', return_value=mock_mongo), \
             patch.object(GenreVectorizer, 'vectorize_game') as mock_vectorize, \
             patch.object(GenreVectorizer, 'build_game_feature_matrix') as mock_build_matrix, \
             patch.object(GenreVectorizer, 'normalize_matrix') as mock_normalize:
            
            # Configure vectorizer mocks
            mock_vectorize.return_value = sample_vectorized_data
            mock_build_matrix.return_value = (np.array([10, 20, 30, 40]), sample_feature_matrix)
            mock_normalize.return_value = sample_normalized_matrix
            
            # Create instance and trigger get_genres
            game_genre = GameGenre()
            
            # Verify all expected calls were made
            mock_collection.find.assert_called_once_with({}, {"_id": 0})
            mock_cursor.sort.assert_called_once_with("AppID", 1)
            mock_vectorize.assert_called_once()
            mock_build_matrix.assert_called_once_with(sample_vectorized_data)
            mock_normalize.assert_called_once_with(sample_feature_matrix)
            
            # Verify instance attributes are set correctly
            pd.testing.assert_frame_equal(game_genre._genre_cache, sample_vectorized_data)
            np.testing.assert_array_equal(game_genre._game_ids, np.array([10, 20, 30, 40]))
            np.testing.assert_array_equal(game_genre._feature_matrix, sample_feature_matrix)
            np.testing.assert_array_equal(game_genre._normalized_matrix, sample_normalized_matrix)

    def test_get_multiple_genres(self, sample_genre_data, sample_vectorized_data):
        """Test the get_multiple_genres method"""
        # First initialize with mocked get_genres
        with patch.object(GameGenre, 'get_genres') as mock_get_genres:
            mock_get_genres.return_value = (None, None, None, None)
            game_genre = GameGenre()
            
            # Now test get_multiple_genres
            mock_mongo = MagicMock()
            mock_collection = MagicMock()
            mock_db = {'steam_genre': mock_collection}
            mock_cursor = MagicMock()
            
            # Use subset of data for specific IDs
            selected_games = sample_genre_data[:2]  # First two games
            mock_cursor.sort.return_value = selected_games
            mock_collection.find.return_value = mock_cursor
            mock_mongo.get_database.return_value = mock_db
            
            with patch('app.services.game_genre.MongoDBSingleton', return_value=mock_mongo), \
                 patch.object(GenreVectorizer, 'vectorize_game') as mock_vectorize:
                
                # Expected result - first two rows
                expected_result = sample_vectorized_data.iloc[:2].reset_index(drop=True)
                mock_vectorize.return_value = expected_result
                
                # Call the method with two AppIDs
                result = game_genre.get_multiple_genres([10, 20])
                
                # Verify method calls
                mock_collection.find.assert_called_with({"AppID": {"$in": [10, 20]}}, {"_id": 0})
                mock_cursor.sort.assert_called_with("AppID", 1)
                mock_vectorize.assert_called_once()
                
                # Verify result
                pd.testing.assert_frame_equal(result, expected_result)