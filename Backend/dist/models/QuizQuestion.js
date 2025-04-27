"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizQuestion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizQuestionSchema = new mongoose_1.default.Schema({
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
exports.QuizQuestion = mongoose_1.default.model('quiz-questions', quizQuestionSchema);
