import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import '../quiz/quiz.css'; 
import { getQuizzes, Quiz as APIQuiz, QuizOption as APIQuizOption } from '../services/api';
import { createStation, saveQuizResponse } from '../services/api';

interface GameOption extends APIQuizOption {}
interface Quiz extends APIQuiz {}

interface SelectionsState {
  games: string[];
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
  const [loading, setLoading] = useState(true);
  const [gameQuiz, setGameQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const quizzes = await getQuizzes();
        const firstQuiz = quizzes.find(quiz => quiz.quizID === 1);
        if (firstQuiz) {
          setGameQuiz(firstQuiz);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  
  const genreOptions: string[] = [
    'Action', 'Adventure', 'Fighting', 'Platformer',
    'Puzzle', 'Racing', 'RPG', 'Shooter',
    'Simulation', 'Sports', 'Strategy', 'Survival Horror'
  ];

  
  const playStyleOptions: string[] = [
    'Solo games', 'Multiplayer with friends', 
    'Competitive multiplayer', 'Co-operative multiplayer'
  ];

  
  const goalOptions: string[] = [
    'Competition and achievement', 'Relaxation and entertainment',
    'Story and immersion', 'Social interaction'
  ];

  const handleGameSelection = (gameId: string): void => {
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

  
  const handleComplete = async (): Promise<void> => {
    try {
      console.log('=== Starting Quiz Completion ===');
      console.log('Current selections:', selections);

      
      if (selections.games.length < 3 || selections.games.length > 6) {
        throw new Error('Please select between 3 and 6 games');
      }
      if (selections.genres.length < 4) {
        throw new Error('Please select at least 4 genres');
      }
      if (selections.playStyles.length < 1) {
        throw new Error('Please select at least 1 play style');
      }
      if (selections.goals.length < 1) {
        throw new Error('Please select at least 1 goal');
      }

      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User must be logged in to create a station');
      }

      console.log('Creating station...');
      const station = await createStation({
        stationID: Date.now(),
        name: stationName,
        type: 'quiz',
        isActive: true,
        userID: userId
      });
      console.log('Station created:', station);

      // Format all quiz responses
      const quizResponses = {
        userID: "1",
        stationID: station.stationID.toString(),
        timestamp: new Date(),
        responses: [
          {
            quizID: 1,
            questionText: gameQuiz?.quizText || 'Select games that interest you',
            questionType: 'multiSelect',
            selection: selections.games,
            selectedGames: gameQuiz?.options
              .filter(option => selections.games.includes(option.id))
              .map(option => ({
                id: option.id,
                name: option.text
              })) ?? []
          },
          {
            quizID: 2,
            questionText: 'Select Your Preferred Genres',
            questionType: 'multiSelect',
            selection: selections.genres,
            selectedGames: []
          },
          {
            quizID: 3,
            questionText: 'Do You Prefer Playing:',
            questionType: 'multiSelect',
            selection: selections.playStyles,
            selectedGames: []
          },
          {
            quizID: 4,
            questionText: 'What Is Your Primary Gaming Goal?',
            questionType: 'multiSelect',
            selection: selections.goals,
            selectedGames: []
          }
        ]
      };

      console.log('Sending quiz responses:', JSON.stringify(quizResponses, null, 2));

      
      const savedResponse = await saveQuizResponse(quizResponses);
      console.log('Quiz responses saved:', savedResponse);

      
      if (isForStationCreation) {
        navigate(`/Recommendations?stationId=${station._id}&new=true&name=${encodeURIComponent(stationName)}`);
      } else {
        navigate('/Recommendations');
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      
    }
  };

  // Quiz Welcome - Step 0
  const renderWelcomeQuiz = () => {
    
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
  const renderGameSelection = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    if (!gameQuiz) {
      return (
        <Typography variant="h6" color="error" textAlign="center">
          Failed to load game options. Please try again later.
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="h4" component="h1" className="quiz-title">
          {gameQuiz.quizText}
        </Typography>
        <Typography variant="body1" className="quiz-subtitle">
          Select at least 3 games you've enjoyed playing
        </Typography>
        <div className="game-grid">
          {gameQuiz.options.map((game) => (
            <div 
              key={game.id}
              className={`game-card ${selections.games.includes(game.id) ? 'selected' : ''}`}
              onClick={() => handleGameSelection(game.id)}
              style={{ cursor: 'pointer' }}
            >
              <img src={game.HeaderImage} alt={game.text} style={{ width: '100%', height: 'auto' }} />
            </div>
          ))}
        </div>
      </>
    );
  };

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
        return selections.games.length < 3 || selections.games.length > 6;
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