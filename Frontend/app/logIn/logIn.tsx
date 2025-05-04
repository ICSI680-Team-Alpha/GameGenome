import './logIn.css';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Username: '',
    Password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'username' ? 'Username' : 'Password']: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', formData);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('userData', JSON.stringify(data.data || {}));
      localStorage.setItem('userId', data.data._id);
      
      console.log('Login successful, navigating to /Stations');
      // Force navigation
      window.location.href = '/Stations';
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <div className="main-container">
      <img src="/Images/LOGO.png" alt="Logo" className="logo" />
      <Box 
        component="form" 
        className="login-form" 
        onSubmit={handleSubmit}
        autoComplete="on"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          width: 350,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
          Log In
        </Typography>
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        <TextField 
          id="username" 
          label="Username" 
          variant="outlined" 
          fullWidth 
          required 
          value={formData.Username}
          onChange={handleChange}
          autoComplete="username"
          inputProps={{
            'aria-label': 'Username'
          }}
        />
        <TextField 
          id="password" 
          label="Password" 
          type="password" 
          variant="outlined" 
          fullWidth 
          required 
          value={formData.Password}
          onChange={handleChange}
          autoComplete="current-password"
          inputProps={{
            'aria-label': 'Password'
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
        >
          Log In
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
            Don't have an account?{' '}
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate('/Signup')}
            sx={{ 
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              p: 0,
              minWidth: 0
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default LogIn;