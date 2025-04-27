"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommendation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recommendationSchema = new mongoose_1.default.Schema({
    stationID: { type: String, required: true },
    userID: { type: String, required: true },
    recommendedGames: [{
            AppID: { type: Number, required: true },
            Name: { type: String, required: true },
            ReleaseDate: { type: String },
            Developer: { type: String },
            Publisher: { type: String },
            PositiveRatings: { type: Number },
            NegativeRatings: { type: Number },
            Price: { type: Number },
            HeaderImage: { type: String }
        }],
    timestamp: { type: Date, default: Date.now }
});
exports.Recommendation = mongoose_1.default.model('recommendations', recommendationSchema);
