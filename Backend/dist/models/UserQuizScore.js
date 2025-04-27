"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuizScore = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userQuizScoreSchema = new mongoose_1.default.Schema({
    UserID: { type: String, required: true },
    StationID: { type: String, required: true },
    quizID: { type: Number, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});
exports.UserQuizScore = mongoose_1.default.model('user-quiz-scores', userQuizScoreSchema);
