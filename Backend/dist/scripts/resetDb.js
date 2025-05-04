"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Counter_1 = require("../models/Counter");
const User_1 = require("../models/User");
async function resetDatabase() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect('mongodb://localhost:27017/Gamegenome');
        // Drop existing collections
        await User_1.User.collection.drop();
        await Counter_1.Counter.collection.drop();
        // Create a fresh counter
        await Counter_1.Counter.create({
            _id: 'userId',
            seq: 0
        });
        console.log('Database reset successful');
        process.exit(0);
    }
    catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}
resetDatabase();
