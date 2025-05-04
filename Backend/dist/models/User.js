"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Drop existing indexes to ensure clean state
mongoose_1.default.connection.once('open', async () => {
    try {
        await mongoose_1.default.connection.collection('users').dropIndexes();
    }
    catch (error) {
        console.log('No indexes to drop');
    }
});
const userSchema = new mongoose_1.default.Schema({
    userID: { type: Number, unique: true, sparse: true },
    Username: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    PasswordHash: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        bio: { type: String },
        avatar: { type: String }
    },
    preferences: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true }
    },
    stats: {
        quizzesTaken: { type: Number, default: 0 },
        quizzesPassed: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    timestamp: { type: Date, default: Date.now }
}, {
    collection: 'users'
});
userSchema.pre('save', function (next) {
    this.UpdatedAt = new Date();
    if (!this.userID) {
        // Generate a unique userID based on timestamp and a random number
        this.userID = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    }
    next();
});
// Create indexes after schema is defined
userSchema.index({ userID: 1 }, { unique: true });
userSchema.index({ Username: 1 }, { unique: true });
userSchema.index({ Email: 1 }, { unique: true });
exports.User = mongoose_1.default.model('users', userSchema);
