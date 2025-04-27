import './signUp.css';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: formData.username,
          Email: formData.email,
          Password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        navigate('/Login'); // Redirect to login page after successful signup
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="main-container">
      <img src="/Images/LOGO.png" alt="Logo" className="logo" />
      <Box
        component="form"
        onSubmit={handleSubmit}
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
          zIndex: 10,
        }}
      >
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
          Sign Up
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
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign Up
        </Button>
      </Box>
    </div>
  );
};

export default SignUp;