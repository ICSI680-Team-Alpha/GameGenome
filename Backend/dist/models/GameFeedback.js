"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFeedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gameFeedbackSchema = new mongoose_1.default.Schema({
    StationID: { type: String, required: true },
    UserID: { type: String, required: true },
    rating: [{
            RatingType: { type: String, required: true },
            RatedDate: { type: Date, required: true },
            AppID: { type: String, required: true }
        }]
});
exports.GameFeedback = mongoose_1.default.model('gamefeedback', gameFeedbackSchema);
