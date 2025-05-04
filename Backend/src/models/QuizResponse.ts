import mongoose, { Schema, Document } from 'mongoose';

interface ISelectedGame {
  id: string;
  name: string;
}

interface IQuestionResponse {
  quizID: number;
  questionText: string;
  questionType: string;
  selection: string[];
  selectedGames: ISelectedGame[];
}

export interface IQuizResponse extends Document {
  userID: string;
  stationID: string;
  timestamp: Date;
  responses: IQuestionResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const selectedGameSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true }
});

const responseSchema = new mongoose.Schema({
  quizID: { type: Number, required: true },
  questionText: { type: String, required: true },
  questionType: { type: String, required: true },
  selection: [{ type: String, required: true }],
  selectedGames: [selectedGameSchema]
});

const quizResponseSchema = new Schema({
  userID: { type: String, required: true },
  stationID: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  responses: [responseSchema]
}, { 
  timestamps: true,
  collection: 'quizResponses'
});

// Add indexes for efficient querying
quizResponseSchema.index({ userID: 1, stationID: 1 });
quizResponseSchema.index({ createdAt: 1 });

// Create the model with explicit collection name
const QuizResponseModel = mongoose.model<IQuizResponse>('QuizResponse', quizResponseSchema, 'quizResponses');

// Add logging to verify collection name
console.log('QuizResponse model collection name:', QuizResponseModel.collection.name);

export const QuizResponse = QuizResponseModel; 