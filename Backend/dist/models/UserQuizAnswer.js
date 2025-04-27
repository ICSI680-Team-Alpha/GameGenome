"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuizAnswer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userQuizAnswerSchema = new mongoose_1.default.Schema({
    UserID: { type: String, required: true },
    StationID: { type: String, required: true },
    quizID: { type: Number, required: true },
    questionID: { type: Number, required: true },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
});
exports.UserQuizAnswer = mongoose_1.default.model('user-quiz-answers', userQuizAnswerSchema);
