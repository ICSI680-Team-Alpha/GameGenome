import { Request, Response, NextFunction } from 'express';
import { Quiz } from '../models/Quiz';
import { UserQuizResponse } from '../models/UserQuizResponse';
import { AppError } from '../middleware/errorHandler';

export const getAllQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({
      status: 'success',
      results: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await Quiz.findOne({ quizID: req.params.id });
    
    if (!quiz) {
      return next(new AppError('No quiz found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

export const saveQuizResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    if (!req.body.timestamp) {
      req.body.timestamp = new Date();
    }
    
    const response = await UserQuizResponse.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
}; 