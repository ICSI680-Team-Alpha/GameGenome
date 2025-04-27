import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button, Typography, Box } from '@mui/material';
import '../quiz/quiz.css'; 

interface GameOption {
  id: number;
  name: string;
  image: string;
}

interface SelectionsState {
  games: number[];
  genres: string[];
  playStyles: string[];
  goals: string[];
}

export default function QuizRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isForStationCreation = searchParams.get('purpose') === 'station';
  const stationName = searchParams.get('name') || 'New Station';
  
  // (welcome page is step 0)
  const [step, setStep] = useState<number>(0);
  const [selections, setSelections] = useState<SelectionsState>({
    games: [],
    genres: [],
    playStyles: [],
    goals: []
  });

  // Sample game data 
  const gameOptions: GameOption[] = [
    { id: 1, name: 'Apex Legends', image: '/Images/batman.jpg' },
    { id: 2, name: 'Fortnite', image: '/Images/god-of-war-ragnarok.jpeg' },
    { id: 3, name: 'Apex Legends', image: '/Images/spiderman2.jpg' },
    { id: 4, name: 'Fortnite', image: '/Images/batman.jpg' },
    { id: 5, name: 'Apex Legends', image: '/Images/god-of-war-ragnarok.jpeg' },
    { id: 6, name: 'Fortnite', image: '/Images/spiderman2.jpg' }
  ];

  // Sample genre data
  const genreOptions: string[] = [
    'Action', 'Adventure', 'Fighting', 'Platformer',
    'Puzzle', 'Racing', 'RPG', 'Shooter',
    'Simulation', 'Sports', 'Strategy', 'Survival Horror'
  ];

  // Sample play style data
  const playStyleOptions: string[] = [
    'Solo games', 'Multiplayer with friends', 
    'Competitive multiplayer', 'Co-operative multiplayer'
  ];

  // Sample gaming goals data
  const goalOptions: string[] = [
    'Competition and achievement', 'Relaxation and entertainment',
    'Story and immersion', 'Social interaction'
  ];

  const handleGameSelection = (gameId: number): void => {
    setSelections(prev => {
      const newGames = prev.games.includes(gameId)
        ? prev.games.filter(id => id !== gameId)
        : [...prev.games, gameId];
      return { ...prev, games: newGames };
    });
  };

  const handleGenreSelection = (genre: string): void => {
    setSelections(prev => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: newGenres };
    });
  };

  const handlePlayStyleSelection = (style: string): void => {
    setSelections(prev => {
      const newStyles = prev.playStyles.includes(style)
        ? prev.playStyles.filter(s => s !== style)
        : [...prev.playStyles, style];
      return { ...prev, playStyles: newStyles };
    });
  };

  const handleGoalSelection = (goal: string): void => {
    setSelections(prev => {
      const newGoals = prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals: newGoals };
    });
  };

  const handleNext = (): void => {
    setStep(prev => prev + 1);
  };

  const handleBack = (): void => {
    setStep(prev => prev - 1);
  };

  // Function to handle quiz completion
  const handleComplete = (): void => {
    // In a real app, you'd save this data to your backend
    console.log('Quiz completed with selections:', selections);
    
    // If this quiz is for station creation, navigate to the new station's recommendations
    if (isForStationCreation) {
      // Use a more deterministic approach for station ID generation
      // This will be replaced by the backend-generated ID in a real app
      const newStationId = `station-${stationName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      navigate(`/Recommendations?stationId=${newStationId}&new=true&name=${encodeURIComponent(stationName)}`);
    } else {
      // Regular quiz completion - go to recommendations
      navigate('/Recommendations');
    }
  };

  // Quiz Welcome - Step 0
  const renderWelcomeQuiz = () => {
    // Different welcome message based on purpose
    const title = isForStationCreation 
      ? `Create Your "${stationName}" Station` 
      : "Welcome to Game Genome";
      
    const subtitle = isForStationCreation
      ? "Let's build a station tailored to your preferences. Answer a few questions to get started."
      : "Let's find your perfect games! First, we'll ask you a few questions to understand your gaming preferences better.";
      
    const buttonText = isForStationCreation ? "Start Building Station" : "Start Quiz";
    
    return (
      <>
        <Typography variant="h4" component="h1" className="quiz-title">
          {title}
        </Typography>
        
        <Typography variant="body1" className="quiz-subtitle">
          {subtitle}
        </Typography>
        
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className="action-button"
          >
            {buttonText}
          </Button>
        </Box>
      </>
    );
  };

  // Game Selection - Step 1
  const renderGameSelection = () => (
    <>
      <Typography variant="h4" component="h1" className="quiz-title">
        Pick Your Favorite Games
      </Typography>
      <Typography variant="body1" className="quiz-subtitle">
        Select at least 3 games you've enjoyed playing
      </Typography>
      <div className="game-grid">
        {gameOptions.map((game) => (
          <div 
            key={game.id}
            className={`game-card ${selections.games.includes(game.id) ? 'selected' : ''}`}
            onClick={() => handleGameSelection(game.id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={game.image} alt={game.name} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>
    </>
  );

  // Genre Selection - Step 2
  const renderGenreSelection = () => (
    <>
      <Typography variant="h4" component="h1" className="quiz-title">
        Select Your Preferred Genres
      </Typography>
      <Typography variant="body1" className="quiz-subtitle">
        Select at least 4 genres you've enjoyed playing
      </Typography>
      <div className="genre-grid">
        {genreOptions.map((genre) => (
          <Button
            key={genre}
            variant="outlined"
            className={`genre-button ${selections.genres.includes(genre) ? 'selected' : ''}`}
            onClick={() => handleGenreSelection(genre)}
          >
            {genre}
          </Button>
        ))}
      </div>
    </>
  );

  // Play Style Selection - Step 3
  const renderPlayStyleSelection = () => (
    <>
      <Typography variant="h4" component="h1" className="quiz-title">
        Do You Prefer Playing:
      </Typography>
      <Typography variant="body1" className="quiz-subtitle">
        (Select at least 1)
      </Typography>
      <div className="playstyle-grid">
        {playStyleOptions.map((style) => (
          <Button
            key={style}
            variant="outlined"
            className={`playstyle-button ${selections.playStyles.includes(style) ? 'selected' : ''}`}
            onClick={() => handlePlayStyleSelection(style)}
          >
            {style}
          </Button>
        ))}
      </div>
    </>
  );

  // Gaming Goals - Step 4
  const renderGoalSelection = () => (
    <>
      <Typography variant="h4" component="h1" className="quiz-title">
        What Is Your Primary Gaming Goal?
      </Typography>
      <Typography variant="body1" className="quiz-subtitle">
        (Select at least 1)
      </Typography>
      <div className="goal-grid">
        {goalOptions.map((goal) => (
          <Button
            key={goal}
            variant="outlined"
            className={`goal-button ${selections.goals.includes(goal) ? 'selected' : ''}`}
            onClick={() => handleGoalSelection(goal)}
          >
            {goal}
          </Button>
        ))}
      </div>
    </>
  );

  // Completion page (after the 4 steps)
  const renderCompletion = () => {
    const title = isForStationCreation 
      ? `"${stationName}" Station Created!` 
      : "All Set!";
      
    const subtitle = isForStationCreation
      ? `We've analyzed your preferences and created your "${stationName}" station with personalized game recommendations.`
      : "We've analyzed your preferences and are ready to show some amazing game recommendations";
      
    const buttonText = isForStationCreation ? "View Your New Station" : "See Recommendations";
    
    return (
      <>
        <Typography variant="h4" component="h1" className="quiz-title">
          {title}
        </Typography>
        <Typography variant="body1" className="quiz-subtitle">
          {subtitle}
        </Typography>
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            className="action-button"
            onClick={handleComplete}
          >
            {buttonText}
          </Button>
        </Box>
      </>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderWelcomeQuiz();
      case 1:
        return renderGameSelection();
      case 2:
        return renderGenreSelection();
      case 3:
        return renderPlayStyleSelection();
      case 4:
        return renderGoalSelection();
      case 5:
        return renderCompletion();
      default:
        return renderWelcomeQuiz();
    }
  };

  const isNextDisabled = (): boolean => {
    switch (step) {
      case 0:
        return false; 
      case 1:
        return selections.games.length < 3;
      case 2:
        return selections.genres.length < 4;
      case 3:
        return selections.playStyles.length < 1;
      case 4:
        return selections.goals.length < 1;
      default:
        return false;
    }
  };

  return (
    <div className="quiz-container">
      <img src="/Images/LOGO.png" alt="GameGenome Logo" className="quiz-logo" />
      
      {step >= 1 && step <= 4 && (
        <div className="step-indicator">
          Step {step} of 4
        </div>
      )}

      <div className="quiz-panel">
        {renderStepContent()}

        {step >= 0 && step <= 4 && step !== 0 && (
          <div className="quiz-navigation">
            {step > 1 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                className="back-button"
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="next-button"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}