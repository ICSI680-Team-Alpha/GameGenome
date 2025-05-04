"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuizAttempt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userQuizAttemptSchema = new mongoose_1.default.Schema({
    UserID: { type: String, required: true },
    StationID: { type: String, required: true },
    quizID: { type: Number, required: true },
    attemptNumber: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    completed: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});
exports.UserQuizAttempt = mongoose_1.default.model('user-quiz-attempts', userQuizAttemptSchema);
