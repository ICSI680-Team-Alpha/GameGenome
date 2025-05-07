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
    console.log('Auth middleware: Checking authentication');
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    console.log('Auth middleware: Auth header:', authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Auth middleware: No Bearer token found');
      return next(new AppError('Please log in to access this resource', 401));
    }

    const token = authHeader.split(' ')[1];
    console.log('Auth middleware: Token found');

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    console.log('Auth middleware: Token decoded, user ID:', decoded.id);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('Auth middleware: User not found');
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }
    console.log('Auth middleware: User found');

    // 4) Grant access to protected route
    req.user = { id: user._id.toString() };
    console.log('Auth middleware: Authentication successful');
    next();
  } catch (error) {
    console.error('Auth middleware: Error:', error);
    return next(new AppError('Invalid token. Please log in again', 401));
  }
}; 