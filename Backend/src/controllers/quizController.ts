import { Request, Response, NextFunction } from 'express';
import { Quiz } from '../models/Quiz';
import { QuizResponse } from '../models/QuizResponse';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { Game } from '../models/Game';

interface QuizResponseData {
  quizID: number;
  questionText: string;
  questionType: string;
  selection: string[];
}

interface QuizPreferences {
  genre: string[];
  platform: string[];
  gameplay: string[];
  story: string[];
  graphics: string[];
  difficulty: string;
}

type PreferenceCategory = keyof Omit<QuizPreferences, 'difficulty'>;
type QuizCategory = PreferenceCategory | 'difficulty';

const isArrayCategory = (category: QuizCategory): category is PreferenceCategory => {
  return ['genre', 'platform', 'gameplay', 'story', 'graphics'].includes(category);
};


export const getQuizzes = catchAsync(async (req: Request, res: Response) => {
  const quizzes = await Quiz.find();
  console.log('Raw quiz data from database:', JSON.stringify(quizzes, null, 2));
  
  
  quizzes.forEach(quiz => {
    console.log(`Quiz ${quiz.quizID} options:`);
    quiz.options.forEach(option => {
      console.log(`- Option ${option.id}: ${option.text}`);
      console.log(`  Image URL: ${option.HeaderImage}`);
    });
  });

  res.status(200).json({
    status: 'success',
    data: quizzes
  });
});


export const saveQuizResponse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('=== Quiz Response Controller ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { userID, stationID, responses } = req.body;

  if (!userID || !stationID || !responses || !Array.isArray(responses)) {
    console.error('Invalid data received:', {
      hasUserID: !!userID,
      hasStationID: !!stationID,
      hasResponses: !!responses,
      isResponsesArray: Array.isArray(responses)
    });
    return next(new AppError('Invalid quiz response data', 400));
  }

  try {
    console.log('Creating quiz response:', {
      userID,
      stationID,
      responseCount: responses.length
    });

    
    const quizResponse = await QuizResponse.create({
      userID,
      stationID,
      responses
    });

    console.log('Successfully created quiz response:', JSON.stringify(quizResponse, null, 2));
    console.log('Response saved to collection:', QuizResponse.collection.name);

    res.status(201).json({
      status: 'success',
      data: quizResponse
    });
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return next(new AppError('Failed to save quiz response', 500));
  }
});


export const getQuizResponseByStation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { stationId } = req.params;
  
  if (!stationId) {
    return next(new AppError('Station ID is required', 400));
  }

  const responses = await QuizResponse.find({ stationId }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: responses
  });
});


export const getQuizResponsesByUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }

  const responses = await QuizResponse.find({ userId }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: responses
  });
}); 