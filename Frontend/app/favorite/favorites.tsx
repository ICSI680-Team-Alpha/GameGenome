import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Button, Box, Typography, Container, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft, faUser, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface Game {
  AppID: number;
  Name: string;
  HeaderImage: string;
  Genres: string;
}
interface Rating {
  GameID: string;
  RatingType: 'positive' | 'negative';
}

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
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
          const formattedGames = gamesRes.data.map((g: any) => ({
            AppID: g.AppID,
            Name: g.Name,
            HeaderImage: g.HeaderImage || '/Images/placeholder.png',
            Genres: g.Genres || ''
          }));
          setGames(formattedGames);
          localStorage.setItem('favorites', JSON.stringify(formattedGames));
        }
      } catch (error) {
        console.error('Fetch error:', error);
        const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
        setGames(stored);
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
      const updated = games.filter(g => g.AppID !== gameId);
      setGames(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Remove error:', error);
      alert('Failed to remove favorite');
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/Stations');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/Images/Background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
      }}>
        <Box sx={{ width: 250, height: 80 }}>
          <img src="/Images/LOGO.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
        <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          FAVORITE GAMES
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faHome} />}
            sx={{ color: 'black', background: 'white', fontWeight: 600, borderRadius: 4, px: 2 }}
            onClick={() => navigate('/Stations')}
          >
            Stations
          </Button>
          <Button
            variant="contained"
            sx={{ color: 'black', background: 'white', fontWeight: 600, borderRadius: 4, px: 2, minWidth: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => navigate('/account')}
          >
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <Button
            variant="contained"
            sx={{ color: 'black', background: 'white', fontWeight: 600, borderRadius: 4, px: 2, minWidth: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Button>
        </Box>
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
        </Box>
        <Grid container spacing={4}>
          {games.length === 0 ? (
            <Typography variant="h6" color="white" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              No favorite games yet
            </Typography>
          ) : (
            games.map((game) => (
              <Grid item key={game.AppID} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.03)' }
                  }}
                  onClick={() => navigate(`/gamePreview/${game.AppID}`)}
                >
                  <CardMedia
                    component="img"
                    image={game.HeaderImage}
                    alt={game.Name}
                    sx={{
                      width: 'auto', 
                      height: 200,       
                      maxWidth: '100%',   
                      margin: '0 auto',   
                      display: 'block'
                    }}
                  />
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        maxWidth: '80%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {game.Name}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(game.AppID);
                      }}
                      sx={{ color: 'red' }}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default FavoritesPage;