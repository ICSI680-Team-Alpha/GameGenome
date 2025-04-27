"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gameSchema = new mongoose_1.default.Schema({
    AppID: { type: Number, required: true },
    Name: { type: String, required: true },
    ReleaseDate: { type: String, required: true },
    Developer: { type: String, required: true },
    Publisher: { type: String, required: true },
    RequiredAge: { type: Number, default: 0 },
    Achievements: { type: Number, default: 0 },
    PositiveRatings: { type: Number, default: 0 },
    NegativeRatings: { type: Number, default: 0 },
    AveragePlaytime: { type: Number, default: 0 },
    MedianPlaytime: { type: Number, default: 0 },
    owners: { type: String, default: '' },
    Price: { type: Number, default: 0 },
    OwnersMin: { type: Number, default: 0 },
    OwnersMax: { type: Number, default: 0 }
});
exports.Game = mongoose_1.default.model('steam', gameSchema);
