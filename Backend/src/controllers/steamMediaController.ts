import { Request, Response, NextFunction } from 'express';
import { SteamMedia } from '../models/SteamMedia';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

export const getMediaByAppId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Attempting to find media for AppID:', req.params.id);
    
    // Add raw MongoDB query for debugging
    const rawDoc = await mongoose.connection.db.collection('steam_media')
      .findOne({ AppID: parseInt(req.params.id) });
    console.log('Raw document from MongoDB:', rawDoc);
    
    const media = await SteamMedia.findOne({ AppID: parseInt(req.params.id) });
    console.log('Media found through Mongoose:', media);
    
    if (!media) {
      return next(new AppError('No media found for this AppID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: media
    });
  } catch (error) {
    console.error('Error in getMediaByAppId:', error);
    next(error);
  }
};

export const getAllMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Attempting to find all media');
    
    // Add raw MongoDB query for debugging
    const rawDocs = await mongoose.connection.db.collection('steam_media')
      .find()
      .limit(1)
      .toArray();
    console.log('Raw sample document from MongoDB:', rawDocs[0]);
    
    const media = await SteamMedia.find();
    console.log('Number of media items found through Mongoose:', media.length);
    console.log('First media item through Mongoose (if any):', media[0]);
    
    res.status(200).json({
      status: 'success',
      results: media.length,
      data: media
    });
  } catch (error) {
    console.error('Error in getAllMedia:', error);
    next(error);
  }
}; 