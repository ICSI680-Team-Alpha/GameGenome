import mongoose from 'mongoose';
import { Counter } from '../models/Counter';
import { User } from '../models/User';

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Gamegenome');
    
    // Drop existing collections
    await User.collection.drop();
    await Counter.collection.drop();
    
    // Create a fresh counter
    await Counter.create({
      _id: 'userId',
      seq: 0
    });
    
    console.log('Database reset successful');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 