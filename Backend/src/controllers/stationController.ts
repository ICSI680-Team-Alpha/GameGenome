import { Request, Response, NextFunction } from 'express';
import { Station } from '../models/Station';
import { AppError } from '../middleware/errorHandler';


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const createStation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return next(new AppError('User must be authenticated to create a station', 401));
    }

    console.log('Backend: Creating station with data:', req.body);
    const station = await Station.create({
      ...req.body,
      userID
    });
    console.log('Backend: Station created successfully:', station);
    res.status(201).json({
      status: 'success',
      data: station
    });
  } catch (error) {
    console.error('Backend: Error creating station:', error);
    next(error);
  }
};

export const getAllStations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return next(new AppError('User must be authenticated to view stations', 401));
    }

    console.log('Backend: Getting stations for user:', userID);
    const stations = await Station.find({ userID: userID }).sort('-timestamp');
    console.log('Backend: Found stations:', stations);
    
    res.status(200).json({
      status: 'success',
      results: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('Backend: Error getting stations:', error);
    next(error);
  }
};

export const getStation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return next(new AppError('User must be authenticated to view stations', 401));
    }

    const station = await Station.findOne({ _id: req.params.id, userID });
    
    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: station
    });
  } catch (error) {
    next(error);
  }
};

export const updateStation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return next(new AppError('User must be authenticated to update stations', 401));
    }

    const station = await Station.findOneAndUpdate(
      { _id: req.params.id, userID },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: station
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return next(new AppError('User must be authenticated to delete stations', 401));
    }

    const station = await Station.findOneAndDelete({ _id: req.params.id, userID });

    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 