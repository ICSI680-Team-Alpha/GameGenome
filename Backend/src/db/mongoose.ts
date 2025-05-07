import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    console.log('=== MongoDB Connection ===');
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Verify quizResponses collection exists
    const quizResponsesExists = collections.some(c => c.name === 'quizResponses');
    console.log('quizResponses collection exists:', quizResponsesExists);
    
    if (!quizResponsesExists) {
      console.log('Creating quizResponses collection...');
      await mongoose.connection.db.createCollection('quizResponses');
      console.log('quizResponses collection created');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 