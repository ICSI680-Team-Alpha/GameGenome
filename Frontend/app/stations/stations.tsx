import { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router';
import './stations.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faGamepad, 
  faTrash,
  faEdit,
  faUser,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

import { getStations, deleteStation, updateStation, Station } from '../services/api';
import AppHeader from '../components/AppHeader';

const Stations = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentStationId, setCurrentStationId] = useState<string | null>(null);
  const [newStationName, setNewStationName] = useState('');
  
  useEffect(() => {
    fetchStations();
  }, []);
  
  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await getStations();
      setStations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError('Failed to load stations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateStation = () => {
    navigate(`/Quiz?purpose=station&name=${encodeURIComponent(newStationName)}`);
    setOpenDialog(false);
    setNewStationName('');
  };

  const handleStationClick = (stationId: string) => {
    navigate(`/Recommendations?stationId=${stationId}`);
  };

  const handleDeleteClick = (stationId: string) => {
    setCurrentStationId(stationId);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (stationId: string) => {
    const station = stations.find(s => s._id === stationId);
    if (station) {
      setNewStationName(station.name);
      setCurrentStationId(stationId);
      setEditDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (currentStationId) {
      try {
        await deleteStation(currentStationId);
        setStations(stations.filter(station => station._id !== currentStationId));
        setDeleteDialogOpen(false);
        setCurrentStationId(null);
      } catch (err) {
        console.error('Error deleting station:', err);
        setError('Failed to delete station. Please try again later.');
      }
    }
  };

  const confirmEdit = async () => {
    if (currentStationId && newStationName.trim()) {
      try {
        const updatedStation = await updateStation(currentStationId, { name: newStationName.trim() });
        setStations(stations.map(station => 
          station._id === currentStationId 
            ? updatedStation 
            : station
        ));
        setEditDialogOpen(false);
        setCurrentStationId(null);
        setNewStationName('');
      } catch (err) {
        console.error('Error updating station:', err);
        setError('Failed to update station. Please try again later.');
      }
    }
  };

  return (
    <div className="stations-container">
      {/* Custom Header (like Favorites) */}
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
          <Button variant="contained" onClick={() => navigate('/account')} sx={{ color: 'black', background: 'white', mr: 1 }}>
            <FontAwesomeIcon icon={faUser} /> Account
          </Button>
          <Button variant="contained" onClick={() => navigate('/favorites')} sx={{ color: 'black', background: 'white' }}>
            <FontAwesomeIcon icon={faHeart} /> Favorite Games
          </Button>
        </Box>
      </Box>
      
      <Typography variant="h3" component="h1" className="stations-title">
        Your Game Stations
      </Typography>
      
      <Typography variant="body1" className="stations-subtitle">
        Create and manage your personalized game recommendation stations
      </Typography>
      
      <Box className="stations-actions">
        <Button
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setOpenDialog(true)}
          className="create-station-button"
        >
          Create New Station
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : stations.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          You haven't created any stations yet. Create your first station to get started!
        </Alert>
      ) : (
        <Grid container spacing={3} className="stations-grid">
          {stations.map((station) => (
            <Grid key={station._id} sx={{ width: '100%', '@media (min-width: 600px)': { width: '50%' }, '@media (min-width: 960px)': { width: '33.33%' } }}>
              <Card className="station-card">
                <div 
                  className="station-image"
                  style={{ 
                    backgroundImage: `url(${station.content?.mediaUrls?.[0] || '/Images/Background.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={() => handleStationClick(station._id || '')}
                >
                  <div className="station-overlay">
                    <FontAwesomeIcon icon={faGamepad} className="play-icon" />
                  </div>
                </div>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {station.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {station.description || 'No description available'}
                  </Typography>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                    {station.type && (
                      <span className="genre-tag">
                        {station.type}
                      </span>
                    )}
                  </Box>
                </CardContent>
                <CardActions disableSpacing className="station-actions">
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleStationClick(station._id || '')}
                  >
                    View Games
                  </Button>
                  <Box>
                    <IconButton 
                      aria-label="edit"
                      onClick={() => handleEditClick(station._id || '')}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleDeleteClick(station._id || '')}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Create Station Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        className="station-dialog"
      >
        <DialogTitle>Create New Station</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Give your station a name, then take a short quiz to tell us your gaming preferences.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Station Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStationName}
            onChange={(e) => setNewStationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateStation} 
            color="primary" 
            disabled={!newStationName.trim()}
            variant="contained"
          >
            Continue to Quiz
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this station? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Station Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      >
        <DialogTitle>Edit Station</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Station Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStationName}
            onChange={(e) => setNewStationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={confirmEdit} 
            color="primary"
            variant="contained"
            disabled={!newStationName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Stations;