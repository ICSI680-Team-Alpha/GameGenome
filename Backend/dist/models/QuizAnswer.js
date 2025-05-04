"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAnswer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizAnswerSchema = new mongoose_1.default.Schema({
    UserID: { type: Number, required: true },
    StationID: { type: Number, required: true },
    quizID: { type: Number, required: true },
    attemptNumber: { type: Number, required: true },
    questionNumber: { type: Number, required: true },
    selectedOption: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
});
exports.QuizAnswer = mongoose_1.default.model('quiz-answers', quizAnswerSchema);
