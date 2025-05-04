"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgress = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userProgressSchema = new mongoose_1.default.Schema({
    userID: { type: Number, required: true },
    stationProgress: [{
            stationID: { type: Number, required: true },
            status: {
                type: String,
                enum: ['not_started', 'in_progress', 'completed', 'failed'],
                default: 'not_started'
            },
            attempts: { type: Number, default: 0 },
            bestScore: { type: Number, default: 0 },
            lastAttempt: { type: Date },
            completionDate: { type: Date }
        }],
    quizProgress: [{
            quizID: { type: Number, required: true },
            status: {
                type: String,
                enum: ['not_started', 'in_progress', 'completed', 'failed'],
                default: 'not_started'
            },
            attempts: { type: Number, default: 0 },
            bestScore: { type: Number, default: 0 },
            lastAttempt: { type: Date },
            completionDate: { type: Date },
            answers: [{
                    questionID: { type: Number },
                    userAnswer: { type: String },
                    isCorrect: { type: Boolean },
                    pointsEarned: { type: Number }
                }]
        }],
    overallProgress: {
        stationsCompleted: { type: Number, default: 0 },
        quizzesCompleted: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 },
        lastActivity: { type: Date }
    },
    timestamp: { type: Date, default: Date.now }
});
exports.UserProgress = mongoose_1.default.model('user_progress', userProgressSchema);
