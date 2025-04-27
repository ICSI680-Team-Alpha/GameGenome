import './logIn.css';
import { TextField, Button, Box, Typography } from '@mui/material';

const LogIn = () => {
  return (
    <div className="main-container">
      <img src="/Images/LOGO.png" alt="Logo" className="logo" />
      <Box 
        component="form" 
        className="login-form" 
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
        <TextField 
          id="username" 
          label="Username" 
          variant="outlined" 
          fullWidth 
          required 
        />
        <TextField 
          id="password" 
          label="Password" 
          type="password" 
          variant="outlined" 
          fullWidth 
          required 
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
        >
          Log In
        </Button>
        
      </Box>
    </div>
  );
};

export default LogIn;