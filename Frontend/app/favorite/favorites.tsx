import { TextField, Button, Box, Typography, Container, Grid, Card, CardMedia, CardContent, IconButton, FormControl, InputLabel, Menu, MenuItem, Select } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { GameFavorite, getFavorites} from '../services/api';

const FavoritesPage = () => { 
  const navigate = useNavigate();

  const [games, setGames] = useState<GameFavorite[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [, setLoading] = useState(false);
  const [searchQuery,setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        setGames(data);
        if (data.some(game=> game.Genre)) {
          const genres = [...new Set(
            data.flatMap(game => game.Genre?.split(',').map((g: string) => g.trim()) || [])
          )].filter(Boolean);
          setAvailableGenres(genres);
        }
      } catch (error) {
        console.error('Failed to get games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (gameId: any, string: any) => {
    try {
      await removeFavorite(gameId,string); 
      setGames(prev => prev.filter(game => game.AppID !== gameId));
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };
 
  const handleBackClick = () => {
    navigate(-1);
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
        <Box>
          <Button variant="contained"
            onClick={() => navigate('/account')}
            sx={{ color: 'black', background: 'white' }}>
            <FontAwesomeIcon icon={faUser} />
            Account
          </Button>
          <Button variant='contained'
            onClick={() => navigate('/')}
            sx={{ color: 'black', ml: 1, background: 'white' }}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Functional Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          {/* Back Button */}
          <Button
            onClick={handleBackClick}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
            sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Select sx={{
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
            '.MuiSvgIcon-root': {color: 'white',}
          }}
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <MenuItem
              sx={{
                backgroundColor: 'white',
                color: 'black' 
              }}
            value="all">All Genres</MenuItem>
            <MenuItem value="Action">Action</MenuItem>
            <MenuItem value="Strategy">Strategy</MenuItem>
            <MenuItem value="Violent">Violent</MenuItem>
            {availableGenres
              .filter(genre => !['Action', 'Strategy', 'Violent'].includes(genre))
              .map(genre => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
          </Select>

          {/* Search Bar */}
          <TextField
  variant="outlined"
  placeholder="Search games..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
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
          {/**GAME GRID DISPLAYED*/}
          <Grid container spacing={4}>
            {games.map((game) => (
              <Card key={game.gameId}
                onClick={() => (navigate('/'))}//add path to GAME PREVIEW
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
                  image={game.gameData.image}
                  sx={{ height: 250, width: 250, objectFit: 'cover' }}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {game.gameData.name}
                  </Typography>
                  <IconButton
                    aria-label="remove from favorites"
                    sx={{ color: 'red' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(game.AppID);
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