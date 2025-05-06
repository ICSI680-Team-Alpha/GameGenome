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
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Snackbar
} from '@mui/material';
import './recommendations.css';
import AppHeader, { HEADER_HEIGHT } from '../components/AppHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faThumbsUp, 
  faThumbsDown, 
  faBookmark,
  faRotate,
  faUser,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

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
    // Get current favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    // Add if not already in favorites
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

  const handleDislike = (gameId: string) => {
    setSnackbarMessage('Disliked!');
    setSnackbarOpen(true);
  };

  const handleSave = (gameId: string) => {
    console.log(`Saved game: ${gameId}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const dismissNewStationMessage = () => {
    setShowNewStationMessage(false);
  };

  return (
    <div className="recommendations-container">
      <AppHeader />
      <div style={{ marginTop: HEADER_HEIGHT + 32 }}>
        {showNewStationMessage && (
          <div className="new-station-alert">
            <Box className="alert-content">
              <Typography variant="body1">
                <strong>Station Created!</strong> Your new "{stationName}" station is ready with personalized game recommendations.
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
        <Box className="recommendations-header">
          <Box className="header-content">
            <IconButton 
              className="back-button" 
              onClick={handleBack}
              aria-label="back to stations"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" className="recommendations-title">
                {stationName}
              </Typography>
              <Typography variant="body1" className="recommendations-subtitle">
                Games tailored to your preferences
              </Typography>
            </Box>
            <Tooltip title="Refresh recommendations">
              <IconButton 
                className="refresh-button" 
                onClick={handleRefresh}
                disabled={loading}
                aria-label="refresh recommendations"
              >
                <FontAwesomeIcon icon={faRotate} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
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
                    <Typography variant="body2">
                      {game.id}
                    </Typography>
                  </Box>
                  <CardContent className="game-content">
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h2" className="game-title">
                        {game.title}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Rating value={game.rating} precision={0.1} readOnly size="small" />
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      className="game-description"
                    >
                      {game.description}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <Tooltip title="Like">
                        <IconButton onClick={() => handleLike(game.id)} color="primary">
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dislike">
                        <IconButton onClick={() => handleDislike(game.id)} color="secondary">
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
    </div>
  );
};

export default Recommendations;
