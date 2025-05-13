import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Quiz.css';

import { getQuizzes, saveQuizResponse, createStation } from '../services/api';

interface QuizOption {
  id: string;
  text: string;
  HeaderImage?: string;
}

interface Quiz {
  _id: string;
  quizID: number;
  quizText: string;
  quizType: string;
  options: QuizOption[];
  maxSelections: number;
  required: boolean;
}

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const purpose = queryParams.get('purpose');
  const stationName = queryParams.get('name');

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getQuizzes();
      console.log('Received quiz data:', data);
      
      // Log each option's imageUrl
      data.forEach(quiz => {
        console.log(`Quiz ${quiz.quizID} options:`);
        quiz.options.forEach(option => {
          console.log(`- Option ${option.id}: ${option.text}`);
          console.log(`  Image URL: ${option.HeaderImage}`);
        });
      });
      
      setQuizzes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quiz questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (quizId: number, optionId: string) => {
    setSelectedOptions(prev => {
      const currentSelections = prev[quizId] || [];
      const currentQuiz = quizzes.find(q => q.quizID === quizId);
      
      if (!currentQuiz) return prev;
      
      let newSelections: string[];
      
      if (currentSelections.includes(optionId)) {
        // Remove the option if it's already selected
        newSelections = currentSelections.filter(id => id !== optionId);
      } else {
        // Add the option if it's not already selected and we haven't reached maxSelections
        if (currentSelections.length < currentQuiz.maxSelections) {
          newSelections = [...currentSelections, optionId];
        } else {
          newSelections = currentSelections;
        }
      }
      
      return {
        ...prev,
        [quizId]: newSelections
      };
    });
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!stationName) {
      setError('Station name is required');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Starting station creation process...');
      
      const stationId = Date.now();
      
      console.log('Creating station with data:', {
        stationID: stationId,
        name: stationName,
        type: 'quiz',
        isActive: true
      });
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User must be logged in to create a station');
      }
      
      const newStation = await createStation({
        stationID: stationId,
        name: stationName,
        type: 'quiz',
        isActive: true,
        userID: userId
      });
      
      console.log('Station created successfully:', newStation);
      
      
      const responses = quizzes.map(quiz => {
        const selectedIds = selectedOptions[quiz.quizID] || [];
        const selectedGames = quiz.options
          .filter(option => selectedIds.includes(option.id))
          .map(option => ({
            id: option.id,
            name: option.text,
            headerImage: option.HeaderImage
          }));

        return {
          quizID: quiz.quizID,
          questionText: quiz.quizText,
          questionType: quiz.quizType,
          selection: selectedIds,
          selectedGames: selectedGames
        };
      });
      
      console.log('Saving quiz responses:', {
        userID: userId,
        stationID: newStation.stationID,
        timestamp: new Date(),
        responses
      });
      
      await saveQuizResponse({
        userID: userId,
        stationID: newStation.stationID.toString(),
        timestamp: new Date(),
        responses
      });
      
      console.log('Quiz responses saved successfully');
      
      
      console.log('Navigating to recommendations page with stationId:', newStation._id);
      navigate(`/Recommendations?stationId=${newStation._id}`);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again later.');
      setSubmitting(false);
    }
  };

  const currentQuiz = quizzes[currentQuizIndex];
  const isLastQuestion = currentQuizIndex === quizzes.length - 1;
  const canProceed = !currentQuiz?.required || 
    (selectedOptions[currentQuiz?.quizID || 0]?.length || 0) > 0;

  return (
    <div className="quiz-container">
      <img src="/Images/LOGO.png" alt="GameGenome Logo" className="quiz-logo" />
      
      <Typography variant="h3" component="h1" className="quiz-title">
        {purpose === 'station' ? 'Create Your Game Station' : 'Game Preference Quiz'}
      </Typography>
      
      {stationName && (
        <Typography variant="h5" className="station-name">
          Station: {decodeURIComponent(stationName)}
        </Typography>
      )}
      
      <Typography variant="body1" className="quiz-subtitle">
        Answer a few questions to help us understand your gaming preferences
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : quizzes.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No quiz questions available. Please try again later.
        </Alert>
      ) : (
        <Paper elevation={3} className="quiz-paper">
          <Stepper activeStep={currentQuizIndex} alternativeLabel className="quiz-stepper">
            {quizzes.map((quiz, index) => (
              <Step key={quiz.quizID}>
                <StepLabel>Question {index + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box className="quiz-content">
            <Typography variant="h5" className="question-text">
              {currentQuiz?.quizText}
            </Typography>
            
            <FormControl component="fieldset" className="options-container">
              <FormGroup>
                {currentQuiz?.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    control={
                      <Checkbox
                        checked={(selectedOptions[currentQuiz.quizID] || []).includes(option.id)}
                        onChange={() => handleOptionChange(currentQuiz.quizID, option.id)}
                        color="primary"
                      />
                    }
                    label={
                      <div className="game-card">
                        {option.HeaderImage && (
                          <img 
                            src={option.HeaderImage} 
                            alt={option.text}
                            className="game-card-image"
                          />
                        )}
                        <Typography 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0,
                            padding: '8px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            fontSize: '0.9rem'
                          }}
                        >
                          {option.text}
                        </Typography>
                      </div>
                    }
                    sx={{
                      margin: '8px 0',
                      width: '100%',
                      '.MuiFormControlLabel-label': {
                        width: '100%'
                      }
                    }}
                  />
                ))}
              </FormGroup>
            </FormControl>
            
            {currentQuiz?.maxSelections > 1 && (
              <Typography variant="body2" color="textSecondary" className="selection-limit">
                Select up to {currentQuiz.maxSelections} options
              </Typography>
            )}
            
            <Box className="quiz-navigation">
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={handlePrevious}
                disabled={currentQuizIndex === 0}
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!canProceed || submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create Station'}
                </Button>
              ) : (
            <Button
              variant="contained"
              color="primary"
                  endIcon={<FontAwesomeIcon icon={faArrowRight} />}
              onClick={handleNext}
                  disabled={!canProceed}
            >
              Next
            </Button>
              )}
            </Box>
          </Box>
        </Paper>
        )}
    </div>
  );
};

export default Quiz;