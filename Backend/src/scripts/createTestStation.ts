import mongoose from 'mongoose';
import { config } from '../config';
import { Station } from '../models/Station';

const createTestStation = async () => {
  try {
    
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    
    const testStation = await Station.create({
      stationID: 1,
      name: 'Test Station',
      description: 'A test station to verify database connection',
      type: 'quiz',
      isActive: true
    });

    console.log('Test station created successfully:', testStation);
    
    
    const savedStation = await Station.findOne({ stationID: 1 });
    console.log('Verified saved station:', savedStation);
    
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test station:', error);
    process.exit(1);
  }
};

createTestStation(); 