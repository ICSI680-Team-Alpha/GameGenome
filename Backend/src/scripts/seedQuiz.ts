import mongoose from 'mongoose';
import { seedQuizzes } from '../data/quizSeed';
import { config } from '../config';
import { Quiz } from '../models/Quiz';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB using the correct URI
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Drop the quiz collection entirely to ensure a clean state
    console.log('Dropping quiz collection...');
    await mongoose.connection.db.dropCollection('quiz').catch(err => {
      if (err.code !== 26) { // 26 is the error code for "namespace not found"
        throw err;
      }
      console.log('Quiz collection did not exist, proceeding with seed...');
    });

    // Run the seeding operation
    await seedQuizzes();
    console.log('Quiz seeding completed successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding process
seedDatabase(); 