import pytest
import numpy as np
import pandas as pd
from unittest.mock import patch, MagicMock

from app.services.genre_vectorizer import GenreVectorizer


class TestGenreVectorizer:
    """Test suite for GenreVectorizer service"""
    
    @pytest.fixture
    def genre_vectorizer(self):
        """Create a fresh GenreVectorizer instance for each test"""
        return GenreVectorizer()
    
    @pytest.fixture
    def sample_game_data(self):
        """Sample game genre data from database"""
        return [
            {"AppID": 10, "genre": {"action": 0.8, "adventure": 0.6, "rpg": 0.4}},
            {"AppID": 20, "genre": {"strategy": 0.9, "simulation": 0.5}},
            {"AppID": 30, "genre": {"action": 0.7, "shooter": 1.0, "multiplayer": 0.8}}
        ]
    
    def test_vectorize_game_success(self, genre_vectorizer, sample_game_data):
        """Test successful vectorization of game genre data"""
        # Execute
        result = genre_vectorizer.vectorize_game(sample_game_data)
        
        # Verify the DataFrame structure
        expected_columns = ["AppID", "action", "adventure", "rpg", "strategy", 
                            "simulation", "shooter", "multiplayer"]
        assert all(col in result.columns for col in expected_columns)
        
        # Verify each game's genres are correctly set
        game_10 = result[result["AppID"] == 10].iloc[0]
        assert game_10["action"] == 0.8
        assert game_10["adventure"] == 0.6
        assert game_10["rpg"] == 0.4
        
        # Other genres should be 0 or NaN - both are acceptable
        for col in ["strategy", "simulation", "shooter", "multiplayer"]:
            assert pd.isna(game_10[col]) or game_10[col] == 0
        
        game_20 = result[result["AppID"] == 20].iloc[0]
        assert game_20["strategy"] == 0.9
        assert game_20["simulation"] == 0.5
        
        # Other genres should be 0 or NaN
        for col in ["action", "adventure", "rpg", "shooter", "multiplayer"]:
            assert pd.isna(game_20[col]) or game_20[col] == 0
        
        game_30 = result[result["AppID"] == 30].iloc[0]
        assert game_30["action"] == 0.7
        assert game_30["shooter"] == 1.0
        assert game_30["multiplayer"] == 0.8
        
        # Other genres should be 0 or NaN
        for col in ["adventure", "rpg", "strategy", "simulation"]:
            assert pd.isna(game_30[col]) or game_30[col] == 0
    
    def test_vectorize_game_empty_data(self, genre_vectorizer):
        """Test vectorize_game with empty data"""
        # Execute
        with patch('builtins.print') as mock_print:
            result = genre_vectorizer.vectorize_game([])
        
        # Verify
        mock_print.assert_called_once()
        assert result is None
    
    def test_build_game_feature_matrix_success(self, genre_vectorizer):
        """Test successful building of game feature matrix"""
        # Setup - create a simple DataFrame
        test_df = pd.DataFrame({
            "AppID": [10, 20, 30],
            "action": [0.8, 0.0, 0.7],
            "adventure": [0.6, 0.0, 0.0]
        })
        
        # Execute
        game_ids, feature_matrix = genre_vectorizer.build_game_feature_matrix(test_df)
        
        # Verify
        expected_ids = np.array([10, 20, 30])
        expected_matrix = test_df.drop(columns='AppID').to_numpy()
        
        np.testing.assert_array_equal(game_ids, expected_ids)
        np.testing.assert_array_equal(feature_matrix, expected_matrix)
    
    def test_build_game_feature_matrix_empty_data(self, genre_vectorizer):
        """Test build_game_feature_matrix with empty data"""
        # Execute
        with patch('builtins.print') as mock_print:
            game_ids, feature_matrix = genre_vectorizer.build_game_feature_matrix(pd.DataFrame())
        
        # Verify
        mock_print.assert_called_once()
        assert game_ids is None
        assert feature_matrix is None
    
    def test_build_game_feature_matrix_missing_appid(self, genre_vectorizer):
        """Test build_game_feature_matrix with data missing AppID column"""
        # Create DataFrame without AppID
        df_without_appid = pd.DataFrame({
            "action": [0.8, 0, 0.7],
            "adventure": [0.6, 0, 0]
        })
        
        # Execute
        with patch('builtins.print') as mock_print:
            game_ids, feature_matrix = genre_vectorizer.build_game_feature_matrix(df_without_appid)
        
        # Verify
        mock_print.assert_called_once()
        assert "AppID column is missing" in mock_print.call_args[0][0]
        assert game_ids is None
        assert feature_matrix is None
    
    def test_normalize_matrix(self, genre_vectorizer):
        """Test matrix normalization"""
        # Setup
        test_vectors = np.array([
            [3.0, 4.0, 0.0],     # norm = 5
            [1.0, 0.0, 0.0],     # norm = 1
            [0.0, 0.0, 0.0],     # norm = 0 (special case)
            [-2.0, -2.0, -1.0]   # norm = 3
        ], dtype=np.float64)
        
        # Execute
        normalized = genre_vectorizer.normalize_matrix(test_vectors)
        
        # Verify normalization of non-zero vectors
        # First vector
        assert abs(normalized[0, 0] - 0.6) < 1e-10
        assert abs(normalized[0, 1] - 0.8) < 1e-10
        assert abs(normalized[0, 2]) < 1e-10
        
        # Second vector
        assert abs(normalized[1, 0] - 1.0) < 1e-10
        assert abs(normalized[1, 1]) < 1e-10
        assert abs(normalized[1, 2]) < 1e-10
        
        # Fourth vector
        assert abs(normalized[3, 0] - (-2/3)) < 1e-10
        assert abs(normalized[3, 1] - (-2/3)) < 1e-10
        assert abs(normalized[3, 2] - (-1/3)) < 1e-10
        
        # For the third vector (zero vector), either check it's not changed
        # or check that it has norm very close to 0
        # We don't assert specific values since different implementations
        # might handle this case differently
        if np.all(normalized[2] == 0):
            # If all zeros, ensure normalization didn't cause NaN values
            assert not np.any(np.isnan(normalized[2]))
        else:
            # If values were changed to small epsilon, check they're close to zero
            assert np.allclose(normalized[2], 0, atol=1e-8)
    
    def test_vectorize_user_preference(self, genre_vectorizer):
        """Test vectorization of user preference data"""
        # Setup sample ratings
        sample_ratings = [
            {"AppID": "10", "RatingType": "positive"},
            {"AppID": "20", "RatingType": "negative"}
        ]
        
        # Mock GameGenre imported inside the method
        mock_game_genre = MagicMock()
        mock_feature_matrix = np.zeros((5, 3))  # 5 games, 3 features
        type(mock_game_genre)._feature_matrix = mock_feature_matrix
        
        # Mock DataFrame for get_multiple_genres
        mock_df = pd.DataFrame({
            "AppID": [10, 20],
            "feature1": [0.8, 0.0],
            "feature2": [0.6, 0.9],
            "feature3": [0.4, 0.5]
        })
        mock_game_genre.get_multiple_genres.return_value = mock_df
        
        # Mock vector result
        mock_result = np.array([[0.1, 0.2, 0.3]])
        
        # Execute with mocks
        with patch("app.services.game_genre.GameGenre", return_value=mock_game_genre), \
             patch.object(genre_vectorizer, "normalize_matrix", return_value=mock_result):
            result = genre_vectorizer.vectorize_user_preference(sample_ratings)
        
        # Verify
        assert mock_game_genre.get_multiple_genres.called
        assert isinstance(result, np.ndarray)
        assert result.shape == mock_result.shape
    
    def test_vectorize_user_preference_no_valid_ratings(self, genre_vectorizer):
        """Test user preference vectorization with no valid ratings"""
        # Setup
        sample_ratings = [
            {"AppID": "10", "RatingType": "positive"},
            {"AppID": "20", "RatingType": "negative"}
        ]
        
        # Mock game genre with feature matrix
        mock_game_genre = MagicMock()
        mock_feature_matrix = np.zeros((5, 3))
        type(mock_game_genre)._feature_matrix = mock_feature_matrix
        
        # Mock DataFrame with non-matching AppIDs
        mock_df = pd.DataFrame({
            "AppID": [30, 40],  # Different from rated games
            "feature1": [0.7, 0.5],
            "feature2": [0.0, 0.8]
        })
        mock_game_genre.get_multiple_genres.return_value = mock_df
        
        # Force all zero vector return and thus none result
        mock_zeros = np.zeros((1, 3))
        
        # Execute with mocks
        with patch("app.services.game_genre.GameGenre", return_value=mock_game_genre), \
             patch("builtins.print") as mock_print, \
             patch.object(np, "all", return_value=True):  # Force zero vector detection
            result = genre_vectorizer.vectorize_user_preference(sample_ratings)
        
        # Verify
        assert mock_print.called
        assert result is None