import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  UserID: { type: Number, required: true },
  StationID: { type: Number, required: true },
  quizID: { type: Number, required: true },
  attemptID: { type: Number, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  completed: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

export const QuizResult = mongoose.model('quiz-results', quizResultSchema); 