import mongoose from 'mongoose';

const userQuizScoreSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  StationID: { type: String, required: true },
  quizID: { type: Number, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const UserQuizScore = mongoose.model('user-quiz-scores', userQuizScoreSchema); 