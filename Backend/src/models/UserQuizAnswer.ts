import mongoose from 'mongoose';

const userQuizAnswerSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  StationID: { type: String, required: true },
  quizID: { type: Number, required: true },
  questionID: { type: Number, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const UserQuizAnswer = mongoose.model('user-quiz-answers', userQuizAnswerSchema); 