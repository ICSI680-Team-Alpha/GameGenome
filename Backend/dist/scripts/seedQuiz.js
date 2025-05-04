"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizSeed_1 = require("../data/quizSeed");
const config_1 = require("../config");
const seedDatabase = async () => {
    try {
        // Connect to MongoDB using the correct URI
        await mongoose_1.default.connect(config_1.config.mongodbUri);
        console.log('Connected to MongoDB');
        // Run the seeding operation
        await (0, quizSeed_1.seedQuizzes)();
        console.log('Quiz seeding completed successfully');
        // Close the connection
        await mongoose_1.default.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
// Run the seeding process
seedDatabase();
