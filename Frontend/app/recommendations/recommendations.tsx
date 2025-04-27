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
  Grid
} from '@mui/material';
import './recommendations.css';

// Import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faThumbsUp, 
  faThumbsDown,
  faBookmark,
  faRotate
} from '@fortawesome/free-solid-svg-icons';

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
  const [stationName, setStationName] = useState('');
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [showNewStationMessage, setShowNewStationMessage] = useState(isNewStation);

  // Mock data - in a real app, you'd fetch this based on stationId
  useEffect(() => {
    // Simulate API request
    setTimeout(() => {
      // If we have a station name from URL (new station), use it
      if (stationNameFromUrl) {
        setStationName(stationNameFromUrl);
      } else if (stationId === '1') {
        setStationName('Action Adventure');
      } else if (stationId === '2') {
        setStationName('Competitive FPS');
      }
      
      if (stationId === '1') {
        setRecommendations([
          {
            id: '1',
            title: 'God of War Ragnarök',
            image: '/Images/god-of-war-ragnarok.jpeg',
            description: 'Join Kratos and Atreus on a mythic journey for answers before Ragnarök arrives.',
            rating: 4.9,
            releaseYear: 2022,
            genres: ['Action', 'Adventure', 'RPG'],
            platforms: ['PS5', 'PS4'],
            matchScore: 98
          },
          {
            id: '2',
            title: 'The Last of Us Part II',
            image: '/Images/last-of-us-2.jpg',
            description: 'Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.',
            rating: 4.8,
            releaseYear: 2020,
            genres: ['Action', 'Adventure', 'Horror'],
            platforms: ['PS5', 'PS4'],
            matchScore: 95
          },
          {
            id: '3',
            title: 'Horizon Forbidden West',
            image: '/Images/horizon-forbidden-west.jpg',
            description: 'Join Aloy as she braves the Forbidden West – a majestic but dangerous frontier that conceals mysterious new threats.',
            rating: 4.7,
            releaseYear: 2022,
            genres: ['Action', 'Adventure', 'RPG'],
            platforms: ['PS5', 'PS4'],
            matchScore: 92
          },
          {
            id: '4',
            title: 'Ghost of Tsushima',
            image: '/Images/ghost-of-tsushima.jpg',
            description: 'In the late 13th century, the Mongol empire has laid waste to entire nations. The island of Tsushima is all that stands between mainland Japan and a massive Mongol invasion.',
            rating: 4.8,
            releaseYear: 2020,
            genres: ['Action', 'Adventure', 'Open World'],
            platforms: ['PS5', 'PS4'],
            matchScore: 90
          },
          {
            id: '5',
            title: 'Elden Ring',
            image: '/Images/elden-ring.jpg',
            description: 'A new fantasy action-RPG from FromSoftware, Inc. and Bandai Namco Entertainment Inc.',
            rating: 4.9,
            releaseYear: 2022,
            genres: ['Action', 'RPG', 'Open World'],
            platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC'],
            matchScore: 88
          },
          {
            id: '6',
            title: 'Red Dead Redemption 2',
            image: '/Images/red-dead-redemption-2.jpg',
            description: 'America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong, Arthur Morgan and the Van der Linde gang are forced to flee.',
            rating: 4.9,
            releaseYear: 2018,
            genres: ['Action', 'Adventure', 'Open World'],
            platforms: ['PS4', 'Xbox One', 'PC'],
            matchScore: 87
          }
        ]);
      } else if (stationId === '2') {
        setStationName('Competitive FPS');
        setRecommendations([
          {
            id: '1',
            title: 'Call of Duty: Modern Warfare III',
            image: '/Images/cod-mw3.jpg',
            description: 'The newest installment in the Call of Duty franchise.',
            rating: 4.3,
            releaseYear: 2023,
            genres: ['FPS', 'Action', 'Multiplayer'],
            platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC'],
            matchScore: 96
          },
          {
            id: '2',
            title: 'Valorant',
            image: '/Images/valorant.jpg',
            description: 'A 5v5 character-based tactical shooter from Riot Games.',
            rating: 4.5,
            releaseYear: 2020,
            genres: ['FPS', 'Tactical', 'Multiplayer'],
            platforms: ['PC'],
            matchScore: 94
          },
          {
            id: '3',
            title: 'Counter-Strike 2',
            image: '/Images/cs2.jpg',
            description: 'The latest version of the iconic competitive shooter.',
            rating: 4.7,
            releaseYear: 2023,
            genres: ['FPS', 'Tactical', 'Multiplayer'],
            platforms: ['PC'],
            matchScore: 92
          },
          {
            id: '4',
            title: 'Battlefield 2042',
            image: '/Images/battlefield-2042.jpg',
            description: 'The latest entry in the Battlefield franchise.',
            rating: 3.8,
            releaseYear: 2021,
            genres: ['FPS', 'Action', 'Multiplayer'],
            platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC'],
            matchScore: 85
          },
          {
            id: '5',
            title: 'Overwatch 2',
            image: '/Images/overwatch-2.jpg',
            description: 'A team-based action game from Blizzard Entertainment.',
            rating: 4.2,
            releaseYear: 2022,
            genres: ['FPS', 'Team-Based', 'Multiplayer'],
            platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC', 'Switch'],
            matchScore: 83
          },
          {
            id: '6',
            title: 'Rainbow Six Siege',
            image: '/Images/rainbow-six-siege.jpg',
            description: 'A tactical shooter focusing on teamwork and destruction.',
            rating: 4.6,
            releaseYear: 2015,
            genres: ['FPS', 'Tactical', 'Multiplayer'],
            platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC'],
            matchScore: 82
          }
        ]);
      } else {
        setStationName('Your Recommendations');
        setRecommendations([
          {
            id: '1',
            title: 'The Legend of Zelda: Tears of the Kingdom',
            image: '/Images/zelda-totk.jpg',
            description: 'The sequel to The Legend of Zelda: Breath of the Wild.',
            rating: 4.9,
            releaseYear: 2023,
            genres: ['Action', 'Adventure', 'Open World'],
            platforms: ['Switch'],
            matchScore: 90
          },
          {
            id: '2',
            title: 'Cyberpunk 2077',
            image: '/Images/cyberpunk-2077.jpg',
            description: 'An open-world, action-adventure RPG set in Night City.',
            rating: 4.3,
            releaseYear: 2020,
            genres: ['RPG', 'Open World', 'Action'],
            platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC'],
            matchScore: 86
          }
        ]);
      }
      setLoading(false);
    }, 1500); 
  }, [stationId, stationNameFromUrl]);

  const handleBack = () => {
    navigate('/Stations');
  };

  const handleLike = (gameId: string) => {
    console.log(`Liked game: ${gameId}`);
    setRecommendations(prev => 
      prev.map(game => 
        game.id === gameId ? { ...game, matchScore: Math.min(99, game.matchScore + 2) } : game
      )
    );
  };

  const handleDislike = (gameId: string) => {
    console.log(`Disliked game: ${gameId}`);
    setRecommendations(prev => 
      prev.map(game => 
        game.id === gameId ? { ...game, matchScore: Math.max(70, game.matchScore - 5) } : game
      )
    );
  };

  const handleSave = (gameId: string) => {
    console.log(`Saved game: ${gameId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  // Dismiss new station alert message
  const dismissNewStationMessage = () => {
    setShowNewStationMessage(false);
  };

    return (
    <div className="recommendations-container">
      <img src="/Images/LOGO.png" alt="GameGenome Logo" className="recommendations-logo" />
      
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
                    {game.matchScore}% match
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
                  
                  <Box display="flex" flexWrap="wrap" mt={1} gap={0.5}>
                    {game.genres.map((genre, index) => (
                    <Chip 
                        key={index} 
                        label={genre} 
                      size="small" 
                        className="genre-chip" 
                      />
                    ))}
                  </Box>
                  
                  <Box display="flex" mt={1}>
                    <Typography variant="body2" color="textSecondary">
                      {game.releaseYear} • 
                    </Typography>
                    <Box display="flex" flexWrap="wrap" ml={1}>
                      {game.platforms.map((platform, index) => (
                        <Typography 
                          key={index} 
                          variant="body2" 
                          color="textSecondary" 
                          component="span"
                        >
                          {platform}{index < game.platforms.length - 1 ? ', ' : ''}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box>
                      <Tooltip title="Like this game">
                        <IconButton 
                          size="small" 
                          className="action-button like-button" 
                          onClick={() => handleLike(game.id)}
                        >
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dislike this game">
                        <IconButton 
                          size="small" 
                          className="action-button dislike-button" 
                          onClick={() => handleDislike(game.id)}
                        >
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Save to library">
                      <IconButton 
                      size="small" 
                        className="action-button save-button" 
                        onClick={() => handleSave(game.id)}
                      >
                        <FontAwesomeIcon icon={faBookmark} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Recommendations;