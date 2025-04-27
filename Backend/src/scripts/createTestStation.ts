import mongoose from 'mongoose';
import { config } from '../config';
import { Station } from '../models/Station';

const createTestStation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Create a test station
    const testStation = await Station.create({
      stationID: 1,
      name: 'Test Station',
      description: 'A test station to verify database connection',
      type: 'quiz',
      isActive: true
    });

    console.log('Test station created successfully:', testStation);
    
    // Verify the station was saved
    const savedStation = await Station.findOne({ stationID: 1 });
    console.log('Verified saved station:', savedStation);
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test station:', error);
    process.exit(1);
  }
};

createTestStation(); 