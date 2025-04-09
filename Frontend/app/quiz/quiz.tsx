import { useState} from 'react';
import { Button, Typography, Box } from '@mui/material';
import './quiz.css';

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

const Quiz: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selections, setSelections] = useState<SelectionsState>({
    games: [],
    genres: [],
    playStyles: [],
    goals: []
  });

  // Sample game data 
  const gameOptions: GameOption[] = [
    { id: 1, name: 'Apex Legends', image: '/Images/apex-legends.png' },
    { id: 2, name: 'Fortnite', image: '/Images/fortnite.png' }
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

  const handleComplete = (): void => {
    console.log('Quiz completed with selections:', selections);
  };

  const renderGameSelection = (): React.ReactNode => (
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
          >
            <img src={game.image} alt={game.name} />
          </div>
        ))}
      </div>
    </>
  );

  const renderGenreSelection = (): React.ReactNode => (
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

  const renderPlayStyleSelection = (): React.ReactNode => (
    <>
      <Typography variant="h4" component="h1" className="quiz-title">
        Do You Preferer Playing:
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

  const renderGoalSelection = (): React.ReactNode => (
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

  const renderCompletion = (): React.ReactNode => (
    <>
      <Typography variant="h4" component="h1" className="quiz-title">
        All Set!
      </Typography>
      <Typography variant="body1" className="quiz-subtitle">
        We've analyzed your preferences and are ready to show 
        some amazing game recommendations
      </Typography>
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          className="action-button"
          onClick={handleComplete}
        >
          See Recommendations
        </Button>
      </Box>
    </>
  );

  const renderStepContent = (): React.ReactNode => {
    switch (step) {
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
        return null;
    }
  };

  const isNextDisabled = (): boolean => {
    switch (step) {
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
      
      {step < 5 && (
        <div className="step-indicator">
          Step {step} of 4
        </div>
      )}

      <div className="quiz-panel">
        {renderStepContent()}

        {step < 5 && (
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
};

export default Quiz;