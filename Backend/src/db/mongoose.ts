import mongoose from 'mongoose';
import { config } from '../config';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected successfully');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Try to count documents in steam_media collection
    const count = await mongoose.connection.db.collection('steam_media').countDocuments();
    console.log('Number of documents in steam_media collection:', count);
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 