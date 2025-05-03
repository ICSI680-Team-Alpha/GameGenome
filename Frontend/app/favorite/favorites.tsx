import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, Box, Typography, Container, Grid, Card, CardMedia, CardContent, IconButton, MenuItem, Select } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { 
  FavoriteGame,
  getFavorites,
  removeFavorite 
} from '../services/api'

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<FavoriteGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<FavoriteGame[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortOrder, setSortOrder] = useState<'title-asc' | 'title-desc'>('title-asc');
  const [loading, setLoading] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        setGames(data);
        setFilteredGames(data);
      
        const genres = [...new Set(
          data.flatMap(game => game.Genre?.split(',').map(g => g.trim()) || [])
        )].filter(Boolean) as string[];
        
        setAvailableGenres(genres);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    let results = games.filter(game => game.isFavorite);
    
    if (selectedGenre !== 'all') {
      results = results.filter(game => 
        game.Genre?.includes(selectedGenre)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(game =>
        game.Name.toLowerCase().includes(query)
      );
      
      // Check if exact match exists
      const exactMatch = games.some(game => 
        game.Name.toLowerCase() === query && game.isFavorite
      );
      
      setSearchQuery(exactMatch ? `"${searchQuery}" is in your favorites` : null);
    } else {
      setSearchQuery(null);
    }
    
    results.sort((a, b) => {
      if (sortOrder === 'title-asc') {
        return a.Name.localeCompare(b.Name);
      } else {
        return b.Name.localeCompare(a.Name);
      }
    });
    
    setFilteredGames(results);
  }, [games, selectedGenre, sortOrder, searchQuery]);

  const handleRemoveFavorite = async (AppID: number) => {
    try {
      await removeFavorite(AppID), {
        rating: {
          RatingType: 'negative',
          RatedDate: new Date().toISOString()
        }
      };
      
      setGames(prev => prev.map(game => 
        game.AppID === AppID ? { ...game, isFavorite: false } : game
      ));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url(/Images/Background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Header Section */}
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
          <Button 
            variant="contained"
            onClick={() => navigate('/account')}
            sx={{ color: 'black', background: 'white' }}
          >
            <FontAwesomeIcon icon={faUser} />
            Account
          </Button>
          <Button 
            variant='contained'
            onClick={() => navigate('/')}
            sx={{ color: 'black', ml: 1, background: 'white' }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Filter/Search Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
            sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value as string)}
              sx={{
                minWidth: 120,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              }}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {availableGenres.map(genre => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </Select>

            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'title-asc' | 'title-desc')}
              sx={{
                minWidth: 120,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              }}
            >
              <MenuItem value="title-asc">A-Z</MenuItem>
              <MenuItem value="title-desc">Z-A</MenuItem>
            </Select>

            <TextField
              variant="outlined"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 300,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Games Grid */}
        {loading ? (
          <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Loading favorites...</Typography>
        ) : filteredGames.length === 0 ? (
          <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
            {games.length === 0 ? 'No favorite games yet' : 'No games match your filters'}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredGames.map((game) => (
              <Grid item key={game.AppID} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'transform 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.03)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={game.HeaderImage || '/Images/placeholder.jpg'}
                    alt={game.Name}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {game.Name}
                    </Typography>
                    {game.Genre && (
                      <Typography variant="body2" color="text.secondary">
                        {game.Genre.split(',').slice(0, 2).join(', ')}
                      </Typography>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      aria-label="remove from favorites"
                      sx={{ color: 'red' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(game.AppID);
                      }}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage;