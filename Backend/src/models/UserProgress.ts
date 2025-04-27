import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userID: { type: Number, required: true },
  stationProgress: [{
    stationID: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'completed', 'failed'],
      default: 'not_started'
    },
    attempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    lastAttempt: { type: Date },
    completionDate: { type: Date }
  }],
  quizProgress: [{
    quizID: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'completed', 'failed'],
      default: 'not_started'
    },
    attempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    lastAttempt: { type: Date },
    completionDate: { type: Date },
    answers: [{
      questionID: { type: Number },
      userAnswer: { type: String },
      isCorrect: { type: Boolean },
      pointsEarned: { type: Number }
    }]
  }],
  overallProgress: {
    stationsCompleted: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    lastActivity: { type: Date }
  },
  timestamp: { type: Date, default: Date.now }
});

export const UserProgress = mongoose.model('user_progress', userProgressSchema); 