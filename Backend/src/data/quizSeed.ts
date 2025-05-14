import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Quiz } from '../models/Quiz';


dotenv.config();

const quizData = [
  {
    quizID: 1,
    quizText: "Select Your Preferred Genres",
    quizType: "multiSelect",
    options: [
      { id: "action", text: "Action" },
      { id: "adventure", text: "Adventure" },
      { id: "fighting", text: "Fighting" },
      { id: "platformer", text: "Platformer" },
      { id: "puzzle", text: "Puzzle" },
      { id: "racing", text: "Racing" },
      { id: "rpg", text: "RPG" },
      { id: "shooter", text: "Shooter" },
      { id: "simulation", text: "Simulation" },
      { id: "sports", text: "Sports" },
      { id: "strategy", text: "Strategy" },
      { id: "survival_horror", text: "Survival Horror" }
    ],
    maxSelections: 4,
    required: true,
    category: "genre"
  },
  {
    quizID: 2,
    quizText: "Which Gaming Platforms Do You Use?",
    quizType: "multiSelect",
    options: [
      { id: "pc", text: "PC (Windows/Mac)" },
      { id: "ps5", text: "PlayStation 5" },
      { id: "ps4", text: "PlayStation 4" },
      { id: "xbox_series", text: "Xbox Series X/S" },
      { id: "xbox_one", text: "Xbox One" },
      { id: "switch", text: "Nintendo Switch" },
      { id: "mobile", text: "Mobile/Tablet" }
    ],
    maxSelections: 3,
    required: true,
    category: "platform"
  },
  {
    quizID: 3,
    quizText: "What Type of Gameplay Do You Prefer?",
    quizType: "multiSelect",
    options: [
      { id: "solo", text: "Single Player" },
      { id: "coop", text: "Co-operative" },
      { id: "competitive", text: "Competitive Multiplayer" },
      { id: "open_world", text: "Open World" },
      { id: "story_driven", text: "Story-Driven" },
      { id: "sandbox", text: "Sandbox/Creative" }
    ],
    maxSelections: 3,
    required: true,
    category: "gameplay"
  },
  {
    quizID: 4,
    quizText: "What Game Difficulty Level Do You Prefer?",
    quizType: "multiSelect",
    options: [
      { id: "casual", text: "Casual/Relaxing" },
      { id: "normal", text: "Normal/Balanced" },
      { id: "challenging", text: "Challenging" },
      { id: "hardcore", text: "Hardcore/Expert" }
    ],
    maxSelections: 2,
    required: true,
    category: "difficulty"
  }
];

export const seedQuizzes = async () => {
  try {
    console.log('Clearing existing quizzes...');
    await Quiz.deleteMany({});
    
    console.log('Creating new quizzes...');
    const quizzes = await Quiz.insertMany(quizData);
    
    console.log('New quizzes in database:', JSON.stringify(quizzes, null, 2));
    
    console.log('Quiz seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding quiz data:', error);
    throw error;
  }
};


seedQuizzes().catch(console.error); 