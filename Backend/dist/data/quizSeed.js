"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedQuizzes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quizData = [
    {
        quizID: 1,
        quizText: "What game genres do you enjoy most?",
        quizType: "multiSelect",
        options: [
            { id: "action", text: "Action" },
            { id: "adventure", text: "Adventure" },
            { id: "rpg", text: "RPG" },
            { id: "strategy", text: "Strategy" },
            { id: "simulation", text: "Simulation" },
            { id: "sports", text: "Sports" },
            { id: "racing", text: "Racing" },
            { id: "puzzle", text: "Puzzle" },
            { id: "horror", text: "Horror" },
            { id: "indie", text: "Indie" }
        ],
        maxSelections: 3,
        required: true
    },
    {
        quizID: 2,
        quizText: "Which gaming platforms do you use?",
        quizType: "multiSelect",
        options: [
            { id: "pc", text: "PC" },
            { id: "playstation", text: "PlayStation" },
            { id: "xbox", text: "Xbox" },
            { id: "nintendo", text: "Nintendo" },
            { id: "mobile", text: "Mobile" }
        ],
        maxSelections: 3,
        required: true
    },
    {
        quizID: 3,
        quizText: "What gameplay features do you prefer?",
        quizType: "multiSelect",
        options: [
            { id: "open_world", text: "Open World" },
            { id: "story", text: "Story-Driven" },
            { id: "multiplayer", text: "Multiplayer" },
            { id: "competitive", text: "Competitive" },
            { id: "casual", text: "Casual" }
        ],
        maxSelections: 3,
        required: true
    }
];
const seedQuizzes = async () => {
    try {
        const db = mongoose_1.default.connection.db;
        console.log('Connected to database:', db.databaseName);
        // Get the quiz collection
        const quizCollection = db.collection('quiz');
        // Clear existing documents
        const deleteResult = await quizCollection.deleteMany({});
        console.log('Deleted documents:', deleteResult.deletedCount);
        // Insert quiz documents
        const insertResult = await quizCollection.insertMany(quizData);
        console.log('Insert result:', insertResult);
        // Verify the insert
        const newDocs = await quizCollection.find({}).toArray();
        console.log('New documents in quiz collection:', newDocs);
        console.log('Quiz seed data inserted successfully');
    }
    catch (error) {
        console.error('Error seeding quiz data:', error);
        throw error;
    }
};
exports.seedQuizzes = seedQuizzes;
