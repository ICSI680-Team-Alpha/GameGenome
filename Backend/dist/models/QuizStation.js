"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizStation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizStationSchema = new mongoose_1.default.Schema({
    stationID: { type: Number, required: true, unique: true },
    stationName: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    quizIDs: [{ type: Number }],
    isActive: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now }
});
exports.QuizStation = mongoose_1.default.model('quiz-stations', quizStationSchema);
