import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('Please log in to access this resource', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // 4) Grant access to protected route
    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again', 401));
  }
}; 