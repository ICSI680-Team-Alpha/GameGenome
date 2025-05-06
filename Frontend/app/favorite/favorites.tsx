import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const FavoritesPage = () => {
const navigate = useNavigate();
const [favoriteGames, setFavoriteGames] = useState<any[]>([]);

useEffect(() => {
  if (!localStorage.getItem('userId')) {
    navigate('/');
  }
}, [navigate]);

useEffect(() => {
  const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  setFavoriteGames(storedFavorites);
}, []);

const handleRemoveFavorite = async (gameId: number) => {
  try {
    // Remove from localStorage
    const updatedFavorites = favoriteGames.filter(game => game.id !== gameId);
    setFavoriteGames(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    // Optionally, also call backend if needed
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
}

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
      <Box>
        <Button variant="contained" 
                onClick={() => navigate('/account')}
                sx={{ color: 'black', background: 'white', mr: 1 }}>
          <FontAwesomeIcon icon={faUser} />
        </Button>
        <Button variant='contained' 
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                sx={{ color: 'black', background:'white'}}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </Button>
      </Box>
    </Box>

    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  mb: 4 }}>
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
      <div className="game-grid">
        <Grid container spacing={4}>
          {favoriteGames.length === 0 ? (
            <Typography variant="h6" color="textSecondary" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              No favorite games yet.
            </Typography>
          ) : favoriteGames.map((game) => (
            <Card
              key={game.id}
              onClick={() => gamePreviewPath(game.id)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardMedia
                component="img"
                image={game.image}
                alt={game.title}
                sx={{ height: 250, width:250, objectFit: 'cover' }}
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  {game.title}
                </Typography>
                <IconButton 
                  aria-label="remove from favorites" 
                  sx={{ color: 'red' }}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveFavorite(game.id);
                  }}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </div>
    </Container>
  </Box>
);
}

export default FavoritesPage;