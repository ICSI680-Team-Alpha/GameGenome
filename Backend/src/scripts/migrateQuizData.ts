import mongoose from 'mongoose';
import { Quiz } from '../models/Quiz';
import dotenv from 'dotenv';

dotenv.config();

const migrateQuizData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamegenome');
    console.log('Connected to MongoDB');

    // Get all documents from user_quiz_responses
    const oldCollection = mongoose.connection.db.collection('user_quiz_responses');
    const oldDocs = await oldCollection.find({}).toArray();
    console.log(`Found ${oldDocs.length} documents to migrate`);

    // Transform and insert into quizzes collection
    for (const doc of oldDocs) {
      // Skip if it's a quiz response (has userId or stationId)
      if (doc.userId || doc.stationId) {
        console.log('Skipping quiz response document');
        continue;
      }

      // Transform the data to match the Quiz schema
      const newQuiz = {
        quizID: doc.quizID || 1, // Default to 1 if not present
        quizText: doc.quizText || 'Select 3 games that interest you the most:',
        quizType: 'multiSelect',
        options: doc.options || [],
        maxSelections: doc.maxSelections || 3,
        required: doc.required !== undefined ? doc.required : true,
        category: doc.category || 'genre'
      };

      try {
        // Insert into quizzes collection
        await Quiz.create(newQuiz);
        console.log(`Migrated quiz with ID: ${newQuiz.quizID}`);
      } catch (error) {
        console.error(`Error migrating quiz with ID ${newQuiz.quizID}:`, error);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

migrateQuizData(); 