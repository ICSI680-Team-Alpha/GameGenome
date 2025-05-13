import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Rating, 
  Tooltip, 
  IconButton, 
  CircularProgress, 
  Grid, 
  Snackbar 
} from '@mui/material';
// import dynamic from 'next/dynamic';
import AppHeader, { HEADER_HEIGHT } from '../components/AppHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faThumbsUp, 
  faThumbsDown, 
  faRotate 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './recommendations.css';

interface Game {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
  releaseYear: number;
  genres: string[];
  platforms: string[];
  matchScore: number;
}

const Recommendations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stationId = searchParams.get('stationId');
  const isNewStation = searchParams.get('new') === 'true';
  const stationNameFromUrl = searchParams.get('name');
  const [loading, setLoading] = useState(true);
  const [stationName, setStationName] = useState('Your Recommendations');
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [showNewStationMessage, setShowNewStationMessage] = useState(isNewStation);
  const [userId, setUserId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (stationNameFromUrl) {
      setStationName(stationNameFromUrl);
    }

    if (!stationId || !storedUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.get(`http://54.87.3.247:8000/api/v1/get_recommendation/${stationId}?n_recommendations=10`)
      .then(async res => {
        const gameIds = res.data;
        const gameDetailsPromises = gameIds.map(async (id: number) => {
          try {
            const gameResponse = await axios.get(`http://54.87.3.247:5000/api/games/${id}`);
            const gameData = gameResponse.data.data;
            return {
              id: id.toString(),
              title: gameData.Name,
              image: gameData.HeaderImage || '/Images/placeholder.png',
              description: gameData.Genres || 'Description not available.',
              rating: 0,
              releaseYear: 0,
              genres: gameData.Genres ? gameData.Genres.split(',').map((g: string) => g.trim()) : [],
              platforms: [],
              matchScore: 0
            };
          } catch (error) {
            console.error(`Error fetching details for game ${id}:`, error);
            return {
              id: id.toString(),
              title: `Game ID: ${id}`,
              image: '/Images/placeholder.png',
              description: 'Description not available.',
              rating: 0,
              releaseYear: 0,
              genres: [],
              platforms: [],
              matchScore: 0
            };
          }
        });

        const gameDetails = await Promise.all(gameDetailsPromises);
        setRecommendations(gameDetails);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching recommendations:', err);
        setLoading(false);
      });
  }, [stationId, stationNameFromUrl]);

  const handleBack = () => {
    navigate('/Stations');
  };

  const handleLike = (gameId: string) => {
    const likedGame = recommendations.find(g => g.id === gameId);
    if (!likedGame) return;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.some((g: any) => g.id === likedGame.id)) {
      favorites.push(likedGame);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setSnackbarMessage(`${likedGame.title} added to favorites!`);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(`${likedGame.title} is already in favorites!`);
      setSnackbarOpen(true);
    }
  };

  const handleDislike = () => {
    setSnackbarMessage('Disliked!');
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const dismissNewStationMessage = () => {
    setShowNewStationMessage(false);
  };

  return (
    <div className="recommendations-container">
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'white' }}>
        <AppHeader />
      </div>
      <Box sx={{ width: '100%', textAlign: 'center', mt: 2, mb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
          Recommendations for {stationName}
        </Typography>
      </Box>

      {showNewStationMessage && (
        <div className="new-station-alert">
          <Box className="alert-content">
            <Typography variant="body1">
              <strong>Station Created!</strong> Your new "{stationName}" station is ready with personalized recommendations.
            </Typography>
            <Button 
              variant="text" 
              size="small" 
              onClick={dismissNewStationMessage}
              sx={{ color: 'white' }}
            >
              Dismiss
            </Button>
          </Box>
        </div>
      )}

      {loading ? (
        <Box className="loading-container">
          <CircularProgress size={60} />
          <Typography variant="h6" className="loading-text">
            Loading your personalized recommendations...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} className="games-grid">
          {recommendations.map((game) => (
            <Grid key={game.id} sx={{ width: '100%', '@media (min-width: 600px)': { width: '50%' }, '@media (min-width: 960px)': { width: '33.33%' } }}>
              <Card className="game-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={game.image}
                  alt={game.title}
                  className="game-image"
                />
                <Box className="match-score">
                  <Typography variant="body2">{game.id}</Typography>
                </Box>
                <CardContent className="game-content">
                  <Typography variant="h6" className="game-title">
                    {game.title}
                  </Typography>
                  <Typography variant="body2" className="game-description">
                    {game.description}
                  </Typography>
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Tooltip title="Like">
                      <IconButton onClick={() => handleLike(game.id)} sx={{ color: '#4CAF50' }}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Dislike">
                      <IconButton onClick={() => handleDislike()} sx={{ color: '#F44336' }}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Recommendations;
