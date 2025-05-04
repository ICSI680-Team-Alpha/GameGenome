"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuizResponse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userQuizResponseSchema = new mongoose_1.default.Schema({
    UserID: { type: String, required: true },
    StationID: { type: String, required: true },
    quizID: { type: Number, required: true },
    response: [{
            id: { type: String, required: true },
            text: { type: String, required: true }
        }],
    timestamp: { type: Date, default: Date.now }
});
exports.UserQuizResponse = mongoose_1.default.model('user-quiz-responses', userQuizResponseSchema);
