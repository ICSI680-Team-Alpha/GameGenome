import { useState } from 'react';
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
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router';
import './stations.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faGamepad, 
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

interface Station {
  id: string;
  name: string;
  image: string;
  description: string;
  genres: string[];
  createdAt: Date;
}

const Stations = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([
    {
      id: '1',
      name: 'Action Adventure',
      image: '/Images/action-adventure.jpg',
      description: 'Games with exploration and combat',
      genres: ['Action', 'Adventure', 'RPG'],
      createdAt: new Date('2025-04-15')
    },
    {
      id: '2',
      name: 'Competitive FPS',
      image: '/Images/fps.jpg',
      description: 'Fast-paced multiplayer shooters',
      genres: ['Shooter', 'Action', 'Multiplayer'],
      createdAt: new Date('2025-04-10')
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentStationId, setCurrentStationId] = useState<string | null>(null);
  const [newStationName, setNewStationName] = useState('');
  
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
    const station = stations.find(s => s.id === stationId);
    if (station) {
      setNewStationName(station.name);
      setCurrentStationId(stationId);
      setEditDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (currentStationId) {
      setStations(stations.filter(station => station.id !== currentStationId));
      setDeleteDialogOpen(false);
      setCurrentStationId(null);
    }
  };

  const confirmEdit = () => {
    if (currentStationId && newStationName.trim()) {
      setStations(stations.map(station => 
        station.id === currentStationId 
          ? { ...station, name: newStationName.trim() } 
          : station
      ));
      setEditDialogOpen(false);
      setCurrentStationId(null);
      setNewStationName('');
    }
  };

  return (
    <div className="stations-container">
      <img src="/Images/LOGO.png" alt="GameGenome Logo" className="stations-logo" />
      
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
      
      <Grid container spacing={3} className="stations-grid">
        {stations.map((station) => (
          <Grid key={station.id} sx={{ width: '100%', '@media (min-width: 600px)': { width: '50%' }, '@media (min-width: 960px)': { width: '33.33%' } }}>
            <Card className="station-card">
              <div 
                className="station-image"
                style={{ backgroundImage: `url(${station.image})` }}
                onClick={() => handleStationClick(station.id)}
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
                  {station.description}
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                  {station.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                </Box>
              </CardContent>
              <CardActions disableSpacing className="station-actions">
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleStationClick(station.id)}
                >
                  View Games
                </Button>
                <Box>
                  <IconButton 
                    aria-label="edit"
                    onClick={() => handleEditClick(station.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton 
                    aria-label="delete"
                    onClick={() => handleDeleteClick(station.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
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