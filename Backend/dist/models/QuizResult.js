"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizResult = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizResultSchema = new mongoose_1.default.Schema({
    UserID: { type: Number, required: true },
    StationID: { type: Number, required: true },
    quizID: { type: Number, required: true },
    attemptID: { type: Number, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timeTaken: { type: Number, required: true }, // in seconds
    completed: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now }
});
exports.QuizResult = mongoose_1.default.model('quiz-results', quizResultSchema);
