import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    bio: { type: String },
    avatar: { type: String }
  },
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  },
  stats: {
    quizzesTaken: { type: Number, default: 0 },
    quizzesPassed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  timestamp: { type: Date, default: Date.now }
});

export const User = mongoose.model('users', userSchema); 