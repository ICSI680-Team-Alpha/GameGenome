# app/services/recommendation_filter.py
import random

class RecommendationFilter:
    def __init__(self, similar_games, rated_games):
        self.similar_games = similar_games
        self.rated_games = rated_games

    def get_recommendations(self, n_recommendations: int) -> list:
        """
        Filter and prioritize game recommendations based on user ratings.
        
        This method creates a balanced recommendation list by:
        1. Including some games the user has already rated (25% of recommendations)
        2. Adding new games the user hasn't rated (75% of recommendations)
        3. Maintaining the original similarity ordering
        
        Args:
            n_recommendation: Number of games to recommend
            
        Returns:
            List of recommended game IDs
        """
        print(f"Similar games: {self.similar_games}")
        print(f"Rated games: {self.rated_games}")
        # if similar_games is empty, raise an exception
        if n_recommendations <= 0:
            raise ValueError("Number of recommendations must be greater than 0.")
        print(f"Number of recommendations: {n_recommendations}")
        if not self.similar_games:
            raise ValueError("No similar games available for recommendations.")
        # if rated_games is empty, raise an exception
        if not self.rated_games:
            return self.similar_games[:n_recommendations]
        # Find games that are both in similar_games and rated_games (common games)
        common_games = [game for game in self.similar_games if game in self.rated_games]
        print(f"Common games: {common_games}")
        
        # Find games that are in similar_games but not in rated_games (new games)
        new_games = [game for game in self.similar_games if game not in self.rated_games]
        print(f"New games: {new_games}")
        
        # Calculate the number of games to include from each category
        n_common = int(n_recommendations * 0.25)  # 25% from common games
        n_new = n_recommendations - n_common      # 75% from new games
        
        if n_common > len(common_games):
            n_common = len(common_games)
            n_new = n_recommendations - n_common
        print(f"Number of common games to select: {n_common}")
        print(f"Number of new games to select: {n_new}")

        # Shuffle and select the required number of games from each category
        random.shuffle(common_games)
        selected_common = common_games[:n_common]
        print(f"Selected common games: {selected_common}")
        
        random.shuffle(new_games)
        selected_new = new_games[:n_new]
        print(f"Selected new games: {selected_new}")
        
        # Combine the selected games
        selected_games = selected_common + selected_new
        print(f"Selected games before shuffling: {selected_games}")
        
        # TODO Reorder the selected games based on their original order in similar_games
        ## TODO But this will have performance impact, so we will not do it for now
        # Reorder based on the original similar_games order
        # Create a dictionary mapping game IDs to their original position
        # original_order = {game_id: idx for idx, game_id in enumerate(self.similar_games)}
        
        # Sort the selected games based on their original order
        # ordered_recommendations = sorted(selected_games, key=lambda game_id: original_order.get(game_id, float('inf')))
        
        return selected_games