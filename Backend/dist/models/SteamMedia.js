"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamMedia = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const steamMediaSchema = new mongoose_1.default.Schema({
    AppID: { type: Number, required: true },
    HeaderImage: { type: String },
    Screenshots: { type: String }, // Stored as stringified JSON
    Background: { type: String },
    Movies: { type: String } // Stored as stringified JSON or null
}, {
    collection: 'steam_media' // Explicitly specify the collection name
});
exports.SteamMedia = mongoose_1.default.model('steam_media', steamMediaSchema);
