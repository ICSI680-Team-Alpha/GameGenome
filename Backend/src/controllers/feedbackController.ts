import { Request, Response, NextFunction } from 'express';
import { GameFeedback } from '../models/GameFeedback';
import { AppError } from '../middleware/errorHandler';

export const getFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, stationId } = req.query;
    
    if (!userId || !stationId) {
      return next(new AppError('User ID and Station ID are required', 400));
    }
    
    const feedback = await GameFeedback.find({
      UserID: userId,
      StationID: stationId
    });
    
    res.status(200).json({
      status: 'success',
      results: feedback.length,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const feedback = await GameFeedback.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
}; 