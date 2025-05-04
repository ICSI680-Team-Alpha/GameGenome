"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const Station_1 = require("../models/Station");
const createTestStation = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(config_1.config.mongodbUri);
        console.log('Connected to MongoDB');
        // Create a test station
        const testStation = await Station_1.Station.create({
            stationID: 1,
            name: 'Test Station',
            description: 'A test station to verify database connection',
            type: 'quiz',
            isActive: true
        });
        console.log('Test station created successfully:', testStation);
        // Verify the station was saved
        const savedStation = await Station_1.Station.findOne({ stationID: 1 });
        console.log('Verified saved station:', savedStation);
        // List all collections in the database
        const collections = await mongoose_1.default.connection.db.listCollections().toArray();
        console.log('Collections in database:', collections.map(c => c.name));
        // Disconnect from MongoDB
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating test station:', error);
        process.exit(1);
    }
};
createTestStation();
