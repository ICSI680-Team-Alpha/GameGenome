import { Request, Response, NextFunction } from 'express';
import { Recommendation } from '../models/Recommendation';
import { Game } from '../models/Game';
import { QuizResponse } from '../models/QuizResponse';
import { AppError } from '../middleware/errorHandler';

// Get recommendations for a user and station
export const getRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, stationId } = req.query;
    
    if (!userId || !stationId) {
      return next(new AppError('User ID and Station ID are required', 400));
    }
    
    // First, check if we already have recommendations for this user and station
    let recommendations = await Recommendation.findOne({
      userID: userId,
      stationID: stationId
    });
    
    // If we don't have recommendations, generate them
    if (!recommendations) {
      // Get the user's quiz responses
      const quizResponses = await QuizResponse.find({
        userID: userId,
        stationID: stationId
      });
      
      if (!quizResponses || quizResponses.length === 0) {
        return next(new AppError('No quiz responses found for this user and station', 404));
      }
      
      // sample games as recommendations
      const sampleGames = await Game.find().limit(5);
      
      recommendations = await Recommendation.create({
        userID: userId,
        stationID: stationId,
        recommendedGames: sampleGames
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// Create recommendations for a user and station
export const createRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, stationId } = req.body;
    
    if (!userId || !stationId) {
      return next(new AppError('User ID and Station ID are required', 400));
    }
    
    //sample games as recommendations
    const sampleGames = await Game.find().limit(5);
    
    const recommendations = await Recommendation.create({
      userID: userId,
      stationID: stationId,
      recommendedGames: sampleGames
    });
    
    res.status(201).json({
      status: 'success',
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
}; 