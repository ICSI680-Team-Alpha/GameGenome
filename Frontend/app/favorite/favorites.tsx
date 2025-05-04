import React from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, Box, Typography, Container, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHeart, faArrowLeft, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const FavoritesPage = () => {
const navigate = useNavigate();

const handleRemoveFavorite = async (gameId: number) => {
  try {
    const response = await fetch(`/api/games/${gameId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`

      }
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    alert('Failed to remove favorite. Please try again.');
  }
};
  //Fix
  //Call API for data for FavoritesGames

const handleBackClick = () => {
    navigate('/'); 
  };
  //navigate to Game Preview
const gamePreviewPath = (gameId: number): void => {
  navigate(`/gamePreview/${gameId}`);
}
  const favoriteGames = [
    { id: 1, title: 'Spiderman ', image: '/Images/spiderman2.jpg' },
    { id: 2, title: 'Batman', image: '/Images/batman.jpg' },
    { id: 3, title: 'Game 3', image: '/Images/batman.jpg' },
    { id: 4, title: 'Game 4', image: '/Images/batman.jpg' },
    { id: 5, title: 'Game 5', image: '/Images/batman.jpg' },
    { id: 6, title: 'Game 6', image: '/Images/batman.jpg' },
  ];

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
          FAVORITES
        </Typography>
        <Box>
          <Button variant="contained" 
                  onClick={() => navigate('/account')}
                  sx={{ color: 'black', background: 'white' }}>
            <FontAwesomeIcon icon={faUser} />
            Account
          </Button>
          <Button variant='contained' 
                  onClick={() => navigate('/welcome')}
                  sx={{ color: 'black', ml: 1 , background:'white'}}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
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
          {favoriteGames.map((game) => (
              <Card
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite()
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
};

export default FavoritesPage;
