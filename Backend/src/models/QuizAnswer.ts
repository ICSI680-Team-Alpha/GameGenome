import mongoose from 'mongoose';

const quizAnswerSchema = new mongoose.Schema({
  UserID: { type: Number, required: true },
  StationID: { type: Number, required: true },
  quizID: { type: Number, required: true },
  attemptNumber: { type: Number, required: true },
  questionNumber: { type: Number, required: true },
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const QuizAnswer = mongoose.model('quiz-answers', quizAnswerSchema); 