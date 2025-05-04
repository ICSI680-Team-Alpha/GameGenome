import mongoose from 'mongoose';

const quizStationSchema = new mongoose.Schema({
  stationID: { type: Number, required: true, unique: true },
  stationName: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  quizIDs: [{ type: Number }],
  isActive: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

export const QuizStation = mongoose.model('quiz-stations', quizStationSchema); 