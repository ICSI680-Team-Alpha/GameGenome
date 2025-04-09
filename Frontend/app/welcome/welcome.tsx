import Button from '@mui/material/Button';
import './welcome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faClipboard, faCircleCheck, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const Welcome = () => {
  return (
    <div className="main-container">
      <img src="/Images/Logo.png" alt="Logo" className="logo" />
      <div className="button-container">
        <Button
          variant="contained"
          sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}
          onClick={() => console.log('Sign Up button clicked')}
        >
          <FontAwesomeIcon icon={faRightToBracket} /> &nbsp;Sign Up
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}
          onClick={() => console.log('Log in button clicked')}
        >
          <FontAwesomeIcon icon={faClipboard} /> &nbsp;Log in
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
            <FontAwesomeIcon icon={faCircleCheck} className="icon" /> &nbsp;
            <div className="box-header">How it works</div>
            <div>Pick your favorite games to start your DNA profile</div>
          </div>
          <div className="info-box">
            <FontAwesomeIcon icon={faBullseye} className="icon" /> &nbsp;
            <div className="box-header">Analyze</div>
            <div>Quick personality quiz to understand your gaming style</div>
          </div>
          <div className="info-box">
            <FontAwesomeIcon icon={faHeart} className="icon" /> &nbsp;
            <div className="box-header">Match</div>
            <div>Get personalized game recommendations that fit you</div>
          </div>
        </div>
        <div className="button-container-centered">
          <Button
            variant="contained"
            sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}
            onClick={() => console.log('Get Started Now button clicked')}
          >
            <FontAwesomeIcon icon={faRightToBracket} /> &nbsp;Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;