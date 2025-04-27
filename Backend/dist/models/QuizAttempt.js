"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAttempt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizAttemptSchema = new mongoose_1.default.Schema({
    attemptID: { type: Number, required: true, unique: true },
    userID: { type: Number, required: true },
    quizID: { type: Number, required: true },
    stationID: { type: Number },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    score: { type: Number },
    passed: { type: Boolean },
    answers: [{
            questionNumber: { type: Number, required: true },
            selectedOption: { type: Number },
            isCorrect: { type: Boolean }
        }],
    timestamp: { type: Date, default: Date.now }
});
exports.QuizAttempt = mongoose_1.default.model('quiz-attempts', quizAttemptSchema);
