import mongoose, { Schema, Document } from 'mongoose';

interface IQuestionResponse {
  questionNumber: number;
  questionText: string;
  selections: string[];
  category: string;
}

export interface IQuizResponse extends Document {
  userId: string;
  stationId: string;
  responses: IQuestionResponse[];
  preferences: {
    genre: string[];
    platform: string[];
    gameplay: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const questionResponseSchema = new Schema({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  selections: [{ type: String, required: true }],
  category: { type: String, required: true }
});

const quizResponseSchema = new Schema({
  userId: { type: String, required: true },
  stationId: { type: String, required: true },
  responses: [questionResponseSchema],
  preferences: {
    genre: [{ type: String }],
    platform: [{ type: String }],
    gameplay: [{ type: String }]
  }
}, { timestamps: true });

// Add indexes for efficient querying
quizResponseSchema.index({ userId: 1, stationId: 1 });
quizResponseSchema.index({ createdAt: 1 });

export const QuizResponse = mongoose.model<IQuizResponse>('QuizResponse', quizResponseSchema); 