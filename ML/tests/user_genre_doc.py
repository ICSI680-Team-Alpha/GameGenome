# tests/user_genre_test.py
import pytest
import numpy as np
from unittest.mock import patch, MagicMock

from app.services.user_genre import UserGenre


class TestUserGenre:
    """Test suite for UserGenre service"""
    
    @pytest.fixture
    def user_genre_service(self):
        """Create a fresh UserGenre instance for each test"""
        return UserGenre()
    
    @pytest.fixture
    def mock_mongodb(self):
        """Setup mock MongoDB connection"""
        mock_mongo = MagicMock()
        mock_db = MagicMock()
        mock_collection = MagicMock()
        
        mock_mongo.get_database.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        
        with patch('app.services.user_genre.MongoDBSingleton', return_value=mock_mongo):
            yield mock_collection
    
    @pytest.fixture
    def sample_user_rating(self):
        """Sample user rating data"""
        return [
            {
                "RatingType": "positive",
                "RatedDate": "2025-04-13T16:16:07.342Z",
                "AppID": "10"
            },
            {
                "RatingType": "negative",
                "RatedDate": "2025-04-13T16:16:07.342Z",
                "AppID": "20"
            }
        ]
    
    def test_load_ratings_success(self, user_genre_service, mock_mongodb, sample_user_rating):
        """Test successful loading of user ratings"""
        # Setup
        user_id = 1
        station_id = 1
        mock_mongodb.find_one.return_value = {
            "UserID": user_id,
            "StationID": station_id,
            "rating": sample_user_rating
        }
        
        # Execute
        result = user_genre_service.load_ratings(user_id, station_id)
        
        # Verify
        assert result is True
        assert user_genre_service.rating == sample_user_rating
        mock_mongodb.find_one.assert_called_once_with({"UserID": user_id, "StationID": station_id})
    
    def test_load_ratings_user_not_found(self, user_genre_service, mock_mongodb, sample_user_rating):
        """Test fallback to default user when requested user not found"""
        # Setup
        user_id = 99
        station_id = 99
        # First call returns None, second call returns default user
        mock_mongodb.find_one.side_effect = [
            None,
            {"UserID": 1, "StationID": 1, "rating": sample_user_rating}
        ]
        
        # Execute
        result = user_genre_service.load_ratings(user_id, station_id)
        
        # Verify
        assert result is True
        assert user_genre_service.rating == sample_user_rating
        assert mock_mongodb.find_one.call_count == 2
        mock_mongodb.find_one.assert_any_call({"UserID": user_id, "StationID": station_id})
        mock_mongodb.find_one.assert_any_call({"UserID": 1, "StationID": 1})
    
    def test_load_ratings_no_rating(self, user_genre_service, mock_mongodb, sample_user_rating):
        """Test fallback to default user when user found but has no rating"""
        # Setup
        user_id = 2
        station_id = 2
        # First call returns user without rating, second call returns default user
        mock_mongodb.find_one.side_effect = [
            {"UserID": user_id, "StationID": station_id},  # No rating field
            {"UserID": 1, "StationID": 1, "rating": sample_user_rating}
        ]
        
        # Execute
        result = user_genre_service.load_ratings(user_id, station_id)
        
        # Verify
        assert result is True
        assert user_genre_service.rating == sample_user_rating
        assert mock_mongodb.find_one.call_count == 2
        mock_mongodb.find_one.assert_any_call({"UserID": user_id, "StationID": station_id})
        mock_mongodb.find_one.assert_any_call({"UserID": 1, "StationID": 1})
    
    def test_load_ratings_default_user_no_rating(self, user_genre_service, mock_mongodb):
        """Test case when even default user has no rating data"""
        # Setup
        user_id = 2
        station_id = 2
        # Both calls return users without ratings
        mock_mongodb.find_one.side_effect = [
            {"UserID": user_id, "StationID": station_id},  # No rating field
            {"UserID": 1, "StationID": 1}  # No rating field
        ]
        
        # Execute
        with patch('builtins.print') as mock_print:
            result = user_genre_service.load_ratings(user_id, station_id)
        
        # Verify
        assert result is False
        assert user_genre_service.rating is None
        mock_print.assert_called_once()
        assert mock_mongodb.find_one.call_count == 2
    
    def test_load_ratings_custom_db_settings(self, user_genre_service):
        """Test loading ratings with custom database settings"""
        # Setup
        user_id = 1
        station_id = 1
        custom_db = "test_db"
        custom_collection = "test_collection"
        sample_rating = [{"AppID": "10", "RatingType": "positive"}]
        
        mock_mongo = MagicMock()
        mock_db = MagicMock()
        mock_collection = MagicMock()
        
        mock_mongo.get_database.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        mock_collection.find_one.return_value = {
            "UserID": user_id,
            "StationID": station_id,
            "rating": sample_rating
        }
        
        # Execute
        with patch('app.services.user_genre.MongoDBSingleton', return_value=mock_mongo):
            result = user_genre_service.load_ratings(user_id, station_id, custom_db, custom_collection)
        
        # Verify
        assert result is True
        assert user_genre_service.rating == sample_rating
        mock_mongo.get_database.assert_called_once_with(custom_db)
        mock_db.__getitem__.assert_called_once_with(custom_collection)
    
    def test_get_user_column_vector(self, user_genre_service):
        """Test retrieving user column vector"""
        # Setup
        sample_rating = [{"AppID": "10", "RatingType": "positive"}]
        expected_vector = np.array([[0.1, 0.2, 0.3]])
        
        user_genre_service.rating = sample_rating
        mock_vectorizer = MagicMock()
        mock_vectorizer.vectorize_user_preference.return_value = expected_vector
        user_genre_service.genre_vectorizer_service = mock_vectorizer
        
        # Execute
        result = user_genre_service.get_user_column_vector()
        
        # Verify
        assert result is expected_vector
        mock_vectorizer.vectorize_user_preference.assert_called_once_with(sample_rating)
    
    def test_get_rated_game_list_success(self, user_genre_service, sample_user_rating):
        """Test retrieving list of rated games"""
        # Setup
        user_genre_service.rating = sample_user_rating
        expected_game_ids = [10, 20]
        
        # Execute
        result = user_genre_service.get_rated_geme_list()
        
        # Verify
        assert result == expected_game_ids
    
    def test_get_rated_game_list_no_rating(self, user_genre_service):
        """Test behavior when no ratings are available"""
        # Setup
        user_genre_service.rating = None
        
        # Execute
        with patch('builtins.print') as mock_print:
            result = user_genre_service.get_rated_geme_list()
        
        # Verify
        assert result == []
        mock_print.assert_called_once()
    
    def test_get_rated_game_list_invalid_id(self, user_genre_service):
        """Test behavior when rating contains invalid game ID"""
        # Setup
        user_genre_service.rating = [
            {"AppID": "10"},  # Valid
            {"AppID": "invalid"},  # Invalid
            {"AppID": "30"}   # Valid
        ]
        
        # Execute and Verify
        with pytest.raises(ValueError) as exc_info:
            user_genre_service.get_rated_geme_list()
        
        assert "Invalid game ID" in str(exc_info.value)