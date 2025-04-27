import mongoose from 'mongoose';

const userQuizResponseSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  StationID: { type: String, required: true },
  quizID: { type: Number, required: true },
  response: [{
    id: { type: String, required: true },
    text: { type: String, required: true }
  }],
  timestamp: { type: Date, default: Date.now }
});

export const UserQuizResponse = mongoose.model('user-quiz-responses', userQuizResponseSchema); 