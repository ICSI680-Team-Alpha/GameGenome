import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  attemptID: { type: Number, required: true, unique: true },
  userID: { type: Number, required: true },
  quizID: { type: Number, required: true },
  stationID: { type: Number },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  score: { type: Number },
  passed: { type: Boolean },
  answers: [{
    questionNumber: { type: Number, required: true },
    selectedOption: { type: Number },
    isCorrect: { type: Boolean }
  }],
  timestamp: { type: Date, default: Date.now }
});

export const QuizAttempt = mongoose.model('quiz-attempts', quizAttemptSchema); 