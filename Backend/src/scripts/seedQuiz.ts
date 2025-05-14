import mongoose from 'mongoose';
import { seedQuizzes } from '../data/quizSeed';
import { config } from '../config';
import { Quiz } from '../models/Quiz';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    
    console.log('Dropping quiz collection...');
    await mongoose.connection.db.dropCollection('quiz').catch(err => {
      if (err.code !== 26) { 
        throw err;
      }
      console.log('Quiz collection did not exist, proceeding with seed...');
    });

    
    await seedQuizzes();
    console.log('Quiz seeding completed successfully');

    
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};


seedDatabase(); 