import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './account.css';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api';

const HEADER_HEIGHT = 100;

const Account = () => {
  const [selectedOption, setSelectedOption] = useState<'Profile' | 'Password'>('Profile');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const user = await getUserById(userId);
        setUsername(user.Username);
        setEmail(user.Email);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="main-container" style={{ minHeight: '100vh', backgroundImage: "url('/Images/Background.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Fixed Header */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 6,
        pt: 4,
        pb: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        background: 'transparent',
        height: `${HEADER_HEIGHT}px`
      }}>
        <img src="/Images/LOGO.png" alt="GameGenome Logo" style={{ height: 60 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ color: 'black', background: 'white', fontWeight: 600, borderRadius: 4, px: 2 }}
            onClick={() => navigate('/Stations')}
          >
            Stations
          </Button>
          <Button variant="outlined" sx={{ color: 'black', background: 'white', fontWeight: 600, borderRadius: 4, px: 2, minWidth: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/Account')}>
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <Button variant="outlined" sx={{ color: 'black', background: 'white', fontWeight: 600, borderRadius: 4, px: 2 }} startIcon={<FontAwesomeIcon icon={faHeart} />} onClick={() => navigate('/Favorites')}>Favorite Games</Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        mt: `${HEADER_HEIGHT + 32}px`, // margin-top to clear the fixed header
        gap: 6
      }}>
        {/* Left Panel */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, minWidth: 260, background: 'rgba(60, 70, 120, 0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Account Settings</Typography>
          <Button
            variant={selectedOption === 'Profile' ? 'contained' : 'outlined'}
            sx={{ width: '100%', mb: 1, fontWeight: 600, background: selectedOption === 'Profile' ? '#444' : 'white', color: selectedOption === 'Profile' ? 'white' : 'black' }}
            onClick={() => setSelectedOption('Profile')}
          >
            Profile
          </Button>
          <Button
            variant={selectedOption === 'Password' ? 'contained' : 'outlined'}
            sx={{ width: '100%', fontWeight: 600, background: selectedOption === 'Password' ? '#444' : 'white', color: selectedOption === 'Password' ? 'white' : 'black' }}
            onClick={() => setSelectedOption('Password')}
          >
            Password
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ width: '100%', fontWeight: 600, mt: 2, background: 'white', color: 'red', borderColor: 'red' }}
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Logout
          </Button>
        </Paper>

        {/* Right Panel */}
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3, minWidth: 500, background: 'rgba(30, 30, 30, 0.7)', color: 'white', boxShadow: '0 4px 32px rgba(0,0,0,0.3)' }}>
          {selectedOption === 'Profile' && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Username</Typography>
              <TextField
                placeholder="Your username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={e => setUsername(e.target.value)}
                sx={{ mb: 4, input: { color: 'white' }, label: { color: 'white' }, background: 'rgba(255,255,255,0.05)' }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Email</Typography>
              <TextField
                placeholder="your.email@example.com"
                variant="outlined"
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{ mb: 4, input: { color: 'white' }, label: { color: 'white' }, background: 'rgba(255,255,255,0.05)' }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <Button variant="contained" color="primary" sx={{ mt: 2, px: 4, fontWeight: 600, borderRadius: 2 }}>Save Changes</Button>
            </Box>
          )}
          {selectedOption === 'Password' && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Change Password</Typography>
              <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 3, input: { color: 'white' }, label: { color: 'white' }, background: 'rgba(255,255,255,0.05)' }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 3, input: { color: 'white' }, label: { color: 'white' }, background: 'rgba(255,255,255,0.05)' }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 3, input: { color: 'white' }, label: { color: 'white' }, background: 'rgba(255,255,255,0.05)' }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <Button variant="contained" color="primary" sx={{ mt: 2, px: 4, fontWeight: 600, borderRadius: 2 }}>Save Password</Button>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default Account;