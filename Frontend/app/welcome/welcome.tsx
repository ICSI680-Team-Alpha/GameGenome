import React from 'react';
import Button from '@mui/material/Button';
import './welcome.css';

const Welcome = () => {
  return (
    <div className="main-container">
      <img src="/public/Images/Logo.png" alt="Logo" className="logo" />
      <div className="button-container">
        <Button
          variant="contained"
          className="white-button"
          onClick={() => console.log('Sign Up button clicked')}
        >
          Sign Up
        </Button>
        <Button
          variant="contained"
          className="white-button"
          onClick={() => console.log('Log in button clicked')}
        >
          Log in
        </Button>
      </div>
      <div>
        <h1 className="h1">Discover your gaming DNA</h1>
        <div className="h2">
          Welcome to Game Genome. Your one stop research facility into your gaming personality.
          Never again wonder what new game to play.
          At our modern, high-tech facility, we have perfected genome sequencing when it comes to your gaming habits.
        </div>
        <div className="h1">How it works</div>
        <div className="info-box-container">
          <div className="info-box">
            <div className="box-header">How it works</div>
            <div>Pick your favorite games to start your DNA profile</div>
          </div>
          <div className="info-box">
            <div className="box-header">Analyze</div>
            <div>Quick personality quiz to understand your gaming style</div>
          </div>
          <div className="info-box">
            <div className="box-header">Match</div>
            <div>Get personalized game recommendations that fit you</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;