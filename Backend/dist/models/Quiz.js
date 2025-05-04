"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizSchema = new mongoose_1.default.Schema({
    quizID: { type: Number, required: true },
    quizText: { type: String, required: true },
    quizType: {
        type: String,
        required: true,
        enum: ['multiSelect']
    },
    options: [{
            id: { type: String, required: true },
            text: { type: String, required: true }
        }],
    maxSelections: { type: Number, required: true, default: 3 },
    required: { type: Boolean, default: true }
}, {
    collection: 'quiz'
});
// Add indexes
quizSchema.index({ quizID: 1 }, { unique: true });
exports.Quiz = mongoose_1.default.model('quiz', quizSchema);
