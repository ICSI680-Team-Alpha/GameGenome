import { Request, Response, NextFunction } from 'express';
import { SteamGame } from '../models/SteamGame';
import { AppError } from '../middleware/errorHandler';

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appId = parseInt(req.params.id);
    
    if (isNaN(appId)) {
      return next(new AppError('Invalid AppID', 400));
    }

    const game = await SteamGame.findOne({ AppID: appId });
    
    if (!game) {
      return next(new AppError('Game not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: game
    });
  } catch (error) {
    next(error);
  }
}; 