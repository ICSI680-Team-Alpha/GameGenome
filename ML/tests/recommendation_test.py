import pytest
import numpy as np
from unittest.mock import patch, MagicMock

class TestRecommendationService:
    @patch('app.services.recommendation.RecommendationService.initialize_model')
    @patch('app.services.recommendation.NearestNeighbors')
    def test_get_recommendations_for_user_size(self, mock_nearest_neighbors, mock_init_model):
        """Test that get_recommendations_for_user returns exactly 5 recommendations."""
        # Import here to avoid circular imports
        from app.services.recommendation import RecommendationService
        
        with patch('app.services.recommendation.GameGenre') as MockGameGenre, \
             patch('app.services.recommendation.UserGenre') as MockUserGenre, \
             patch('app.services.recommendation.RecommendationFilter') as MockRecommendationFilter:
            
            # Setup GameGenre mock
            game_genre_instance = MockGameGenre.return_value
            type(game_genre_instance).game_ids = property(
                lambda self: np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
            )
            type(game_genre_instance)._game_ids = property(
                lambda self: np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
            )
            type(game_genre_instance)._normalized_matrix = property(
                lambda self: np.array([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8], [0.9, 1.0],
                                      [1.1, 1.2], [1.3, 1.4], [1.5, 1.6], [1.7, 1.8], [1.9, 2.0]])
            )
            
            # Configure the NearestNeighbors mock
            nn_instance = mock_nearest_neighbors.return_value
            nn_instance.kneighbors.return_value = (
                np.array([[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]]),  # distances
                np.array([[2, 3, 4, 5, 6, 7, 8, 9]])                   # indices
            )
            
            # Create a clean instance - bypass singleton by mocking
            service = RecommendationService.__new__(RecommendationService)
            service.game_genre_service = game_genre_instance
            service.game_ids = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
            service.normalized_matrix = np.array([[0.1, 0.2], [0.3, 0.4]])
            service.recommender = nn_instance
            service.is_trained = True
            
            # Setup UserGenre mock - create a separate instance to avoid the double call issue
            user_genre_instance = MagicMock()
            MockUserGenre.return_value = user_genre_instance
            user_genre_instance.load_ratings.return_value = True
            user_genre_instance.get_user_column_vector.return_value = np.array([[0.1, 0.2]])
            user_genre_instance.get_rated_geme_list.return_value = [10, 20]
            
            # Setup RecommendationFilter mock
            filter_instance = MockRecommendationFilter.return_value
            filter_instance.get_recommendations.return_value = [30, 40, 50, 60, 70]
            
            # Execute the method we're testing
            result = service.get_recommendations_for_user(1, 1, 5)
            
            # Assert that the result contains exactly 5 recommendations
            assert len(result) == 5
            assert result == [30, 40, 50, 60, 70]
            
            # Verify the mocks were called correctly
            # user_genre_instance.load_ratings.assert_called_once_with(1, 1)
            user_genre_instance.get_user_column_vector.assert_called_once()
            user_genre_instance.get_rated_geme_list.assert_called_once()
            nn_instance.kneighbors.assert_called_once()
            
            # Check that RecommendationFilter was created with correct parameters
            expected_similar_games = [30, 40, 50, 60, 70, 80, 90, 100]
            MockRecommendationFilter.assert_called_once_with(
                similar_games=expected_similar_games, 
                rated_games=[10, 20]
            )
            filter_instance.get_recommendations.assert_called_once_with(n_recommendations=5)