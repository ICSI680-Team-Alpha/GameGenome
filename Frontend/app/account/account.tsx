import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './account.css';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, TextField, Typography } from '@mui/material';

const Account = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="main-container">
      <header className="header">
        <div className="headerLogo">
          <img src="/Images/LOGO.png" alt="Logo" style={{ height: 'auto' }} />
        </div>
        <button
          className="accBtn"
          onClick={() => (window.location.href = '/account')}
        >
          <FontAwesomeIcon icon={faUser} />
          Account
        </button>
        <button className="logBtn">
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      </header>

      {/* Account Settings Section */}
      <div className="main-content">
        <Box sx={{ display: 'flex', gap: 4, padding: 4 }}>
          {/* First Box: Main Options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Account Settings
            </Typography>
            <Button
              variant="contained"
              onClick={() => setSelectedOption('Profile')}
            >
              Profile
            </Button>
            <Button
              variant="contained"
              onClick={() => setSelectedOption('Password')}
            >
              Password
            </Button>
          </Box>

          {selectedOption === 'Profile' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>
                Profile Settings
              </Typography>
              <TextField
                label="Username"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'white' } },
                  input: { style: { color: 'white' } },
                }}
              />
              <TextField
                label="Email"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'white' } },
                  input: { style: { color: 'white' } },
                }}
              />
            </Box>
          )}

          {selectedOption === 'Password' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>
                Password Settings
              </Typography>
              <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'white' } },
                  input: { style: { color: 'white' } },
                }}
              />
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'white' } },
                  input: { style: { color: 'white' } },
                }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'white' } },
                  input: { style: { color: 'white' } },
                }}
              />
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Account;