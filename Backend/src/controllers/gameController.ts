import { Request, Response, NextFunction } from 'express';
import { Game } from '../models/Game';
import { AppError } from '../middleware/errorHandler';

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find();
    res.status(200).json({
      status: 'success',
      results: games.length,
      data: games
    });
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const game = await Game.findOne({ AppID: req.params.id });
    
    if (!game) {
      return next(new AppError('No game found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: game
    });
  } catch (error) {
    next(error);
  }
}; 