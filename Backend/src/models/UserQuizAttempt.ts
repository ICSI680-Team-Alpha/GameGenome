import mongoose from 'mongoose';

const userQuizAttemptSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  StationID: { type: String, required: true },
  quizID: { type: Number, required: true },
  attemptNumber: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  completed: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export const UserQuizAttempt = mongoose.model('user-quiz-attempts', userQuizAttemptSchema); 