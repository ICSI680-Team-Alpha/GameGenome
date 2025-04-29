import { Request, Response, NextFunction } from 'express';
import { Quiz } from '../models/Quiz';
import { QuizResponse } from '../models/QuizResponse';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

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

// Get all active quizzes
export const getQuizzes = catchAsync(async (req: Request, res: Response) => {
  const quizzes = await Quiz.find();
  res.status(200).json({
    status: 'success',
    data: quizzes
  });
});

// Save quiz response
export const saveQuizResponse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, stationId, responses } = req.body;

  if (!userId || !stationId || !responses || !Array.isArray(responses)) {
    return next(new AppError('Invalid quiz response data', 400));
  }

  // Initialize preferences object
  const preferences = {
    genre: [] as string[],
    platform: [] as string[],
    gameplay: [] as string[]
  };

  // Process each question response and categorize selections
  responses.forEach(response => {
    if (response.category && response.selections) {
      switch (response.category.toLowerCase()) {
        case 'genre':
          preferences.genre.push(...response.selections);
          break;
        case 'platform':
          preferences.platform.push(...response.selections);
          break;
        case 'gameplay':
          preferences.gameplay.push(...response.selections);
          break;
        default:
          // Skip other categories
          break;
      }
    }
  });

  // Create new quiz response with processed preferences
  const quizResponse = await QuizResponse.create({
    userId,
    stationId,
    responses,
    preferences
  });

  res.status(201).json({
    status: 'success',
    data: quizResponse
  });
});

// Get quiz response by station ID
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

// Get quiz response by user ID
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