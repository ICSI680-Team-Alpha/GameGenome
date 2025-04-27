import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  quizID: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [{
    questionID: { type: Number, required: true },
    text: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      default: 'multiple-choice'
    },
    options: [{ 
      text: { type: String },
      isCorrect: { type: Boolean }
    }],
    correctAnswer: { type: String },
    points: { type: Number, default: 1 }
  }],
  timeLimit: { type: Number }, // in minutes
  passingScore: { type: Number, default: 70 }, // percentage
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: { type: String },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

export const Quiz = mongoose.model('quizzes', quizSchema); 