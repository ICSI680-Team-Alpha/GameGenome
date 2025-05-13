import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Grid, Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import AppHeader from '../components/AppHeader';
import './favorites.css';
import axios from 'axios';

interface Game {
  AppID: number;
  Name: string;
  Image: string;
  Genres: string;
}
interface Rating {
  GameID: string;
  RatingType: 'positive' | 'negative';
}

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteGames, setFavoriteGames] = useState<any[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) navigate('/');
    const fetchGames = async () => {
      try {
        const feedbackRes = await axios.get(`http://54.87.3.247:8000/api/v1/game_feedback?userId=${userId}`);
        const positiveIds = feedbackRes.data
          .flatMap((f: any) => f.rating)
          .filter((r: Rating) => r.RatingType === 'positive')
          .map((r: Rating) => parseInt(r.GameID));

        if (positiveIds.length > 0) {
          const gamesRes = await axios.post(`http://54.87.3.247:8000/api/v1/games`, { gameIds: positiveIds });
          const favoriteGames = gamesRes.data.map((g: any) => ({
            AppID: g.AppID,
            Name: g.Name,
            Image: g.Image || '/Images/placeholder.png',
            Genres: g.Genres || ''
          }));
          setFavoriteGames(favoriteGames);
          localStorage.setItem('favorites', JSON.stringify(favoriteGames));
        }
      } catch (error) {
        console.error('Fetch error:', error);
        const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavoriteGames(stored);

      }
    };

    fetchGames();
  }, [userId, navigate]);

  const handleRemoveFavorite = async (gameId: number) => {
    try {
      await axios.patch(`http://54.87.3.247:8000/api/v1/game_feedback`, {
        userId,
        gameId,
        ratingType: 'negative'
      });

      const updatedFavorites = favoriteGames.filter(game => game.AppID !== gameId);
      setFavoriteGames(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/Stations');
    }
  };

  const gamePreviewPath = (gameId: number): void => {
    navigate(`/gamePreview/${gameId}`);
  };

  return (
    <div className="favorites-container">
      <AppHeader />
      
      <Box sx={{ width: '100%', textAlign: 'center', mt: 2, mb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
          Your Favorite Games
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            onClick={handleBackClick}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
            sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
          >
            Back
          </Button>
          <TextField
            variant="outlined"
            placeholder="Search games..."
            sx={{
              width: '40%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {favoriteGames.length === 0 ? (
          <Typography variant="h6" color="textSecondary" sx={{ width: '100%', textAlign: 'center', mt: 4, color: 'white' }}>
            No favorite games yet.
          </Typography>
        ) : (
          <Grid container spacing={3} className="games-grid">
            {favoriteGames.map((game) => (
              <Grid key={game.id} sx={{ width: '100%', '@media (min-width: 600px)': { width: '50%' }, '@media (min-width: 960px)': { width: '33.33%' } }}>
                <Card className="game-card">
                  <CardMedia
                    component="img"
                    height="200"
                    image={game.image}
                    alt={game.title}
                    className="game-image"
                    onClick={() => gamePreviewPath(game.id)}
                  />
                  <CardContent className="game-content">
                    <Typography variant="h6" className="game-title">
                      {game.title}
                    </Typography>
                    <Typography variant="body2" className="game-description">
                      {game.description}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <Tooltip title="Remove from favorites">
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(game.id);
                          }}
                          sx={{ 
                            color: '#F44336',
                            '&:hover': {
                              color: '#d32f2f',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default FavoritesPage;
