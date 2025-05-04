import mongoose from 'mongoose';
import { config } from '../config';
import { Quiz } from '../models/Quiz';

const checkQuizData = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const quiz = await Quiz.findOne({ quizID: 1 });
    if (!quiz) {
      console.log('No quiz found with ID 1');
      return;
    }

    console.log('Current quiz data:');
    console.log('Quiz ID:', quiz.quizID);
    console.log('Quiz Text:', quiz.quizText);
    console.log('Options:');
    quiz.options.forEach((opt, index) => {
      console.log(`${index + 1}. ${opt.text} (ID: ${opt.id})`);
      console.log(`   Image URL: ${opt.HeaderImage}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking quiz data:', error);
    process.exit(1);
  }
};

checkQuizData(); 