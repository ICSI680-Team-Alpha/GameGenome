import { Request, Response, NextFunction } from 'express';
import { Station } from '../models/Station';
import { AppError } from '../middleware/errorHandler';

export const createStation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Backend: Creating station with data:', req.body);
    const station = await Station.create(req.body);
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
    const stations = await Station.find().sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: stations.length,
      data: stations
    });
  } catch (error) {
    next(error);
  }
};

export const getStation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const station = await Station.findById(req.params.id);
    
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
    const station = await Station.findByIdAndUpdate(
      req.params.id,
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
    const station = await Station.findByIdAndDelete(req.params.id);

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