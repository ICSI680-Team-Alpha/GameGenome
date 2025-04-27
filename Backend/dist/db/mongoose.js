"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongodbUri);
        console.log('MongoDB connected successfully');
        // List all collections in the database
        const collections = await mongoose_1.default.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        // Try to count documents in steam_media collection
        const count = await mongoose_1.default.connection.db.collection('steam_media').countDocuments();
        console.log('Number of documents in steam_media collection:', count);
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
