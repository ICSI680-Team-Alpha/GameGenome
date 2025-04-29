"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
exports.Counter = mongoose_1.default.model('Counter', counterSchema);
