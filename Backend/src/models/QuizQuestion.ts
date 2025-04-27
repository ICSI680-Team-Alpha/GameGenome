import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  quizID: { type: Number, required: true },
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  explanation: { type: String },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const QuizQuestion = mongoose.model('quiz-questions', quizQuestionSchema); 