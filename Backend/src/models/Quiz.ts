import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  HeaderImage: { type: String } // Using HeaderImage to match Steam data
});

const quizSchema = new mongoose.Schema({
  quizID: { type: Number, required: true, unique: true },
  quizText: { type: String, required: true },
  quizType: { 
    type: String, 
    required: true,
    enum: ['multiSelect']
  },
  options: [optionSchema],
  maxSelections: { type: Number, required: true, default: 3 },
  required: { type: Boolean, default: true },
  category: {
    type: String,
    required: true,
    enum: ['genre', 'platform', 'gameplay', 'difficulty']
  }
}, {
  timestamps: true,
  collection: 'quizzes'
});

// Add indexes
quizSchema.index({ quizID: 1 }, { unique: true });

export const Quiz = mongoose.model('quiz', quizSchema); 