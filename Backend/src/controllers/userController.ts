import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Username, Email, Password } = req.body;
    
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { Username: Username },
        { Email: Email }
      ]
    });

    if (existingUser) {
      throw new AppError('Username or email already exists', 400);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    
    const now = new Date();
    
    const user = await User.create({
      Username,
      Email,
      PasswordHash: hashedPassword,
      CreatedAt: now,
      UpdatedAt: now,
      isActive: true,
      lastLogin: null,
      preferences: {
        theme: "light",
        notifications: true
      },
      profile: {
        firstName: "",
        lastName: "",
        bio: "",
        avatar: ""
      },
      role: "user",
      stats: {
        quizzesTaken: 0,
        quizzesPassed: 0,
        averageScore: 0
      },
      timestamp: now
    });

    // Remove password hash from response
    const userResponse = user.toObject();
    delete (userResponse as any).PasswordHash;

    res.status(201).json({ 
      status: 'success', 
      message: 'User created successfully',
      data: userResponse 
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }).select('-PasswordHash');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Username, Password } = req.body;

    // Find user by username
    const user = await User.findOne({ Username });

    if (!user) {
      throw new AppError('Invalid username or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(Password, user.PasswordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid username or password', 401);
    }

    // Update last login
    const now = new Date();
    await User.updateOne(
      { _id: user._id },
      { 
        $set: {
          lastLogin: now,
          UpdatedAt: now
        }
      }
    );

    // Create response without password hash
    const userResponse = user.toObject();
    delete (userResponse as any).PasswordHash;

    res.status(200).json({ 
      status: 'success',
      message: 'Login successful',
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
}; 

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const update = req.body;
    const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select('-PasswordHash');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};