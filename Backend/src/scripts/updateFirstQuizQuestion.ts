import mongoose from 'mongoose';
import { config } from '../config';
import { Quiz } from '../models/Quiz';
import { SteamGame } from '../models/SteamGame';

const updateFirstQuizQuestion = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    
    const games = await SteamGame.aggregate([
      { $match: { 
        HeaderImage: { $exists: true, $ne: null },
        Genres: { $exists: true, $ne: null },
        owners: { $exists: true, $ne: null }
      }},
      { $sort: { owners: -1 } }, 
      { $limit: 100 }, 
      { $group: { 
        _id: "$Genres",
        games: { $push: "$$ROOT" }
      }},
      { $project: {
        game: { $arrayElemAt: ["$games", 0] }
      }},
      { $match: { 'game.HeaderImage': { $exists: true, $ne: null } } }, 
      { $limit: 6 }
    ], { allowDiskUse: true });

    if (games.length < 6) {
      throw new Error('Not enough diverse games with images found in steam_info collection');
    }

    
    const newOptions = games.map(game => {
      console.log('Processing game:', {
        id: game.game.AppID,
        name: game.game.Name,
        HeaderImage: game.game.HeaderImage
      });
      return {
        id: game.game.AppID.toString(),
        text: game.game.Name,
        HeaderImage: game.game.HeaderImage 
      };
    });

    
    const firstQuizData = {
      quizID: 1,
      quizText: "Select 3 games that interest you the most:",
      quizType: "multiSelect",
      options: newOptions,
      maxSelections: 3,
      required: true,
      category: "genre"
    };

    
    const result = await Quiz.updateOne(
      { quizID: 1 },
      { $set: firstQuizData },
      { upsert: true }
    );

    console.log('Update result:', result);
    console.log('Successfully updated first quiz question with games:', 
      newOptions.map(opt => `${opt.text} (ID: ${opt.id}, Image: ${opt.HeaderImage})`).join('\n'));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error updating first quiz question:', error);
    process.exit(1);
  }
};


updateFirstQuizQuestion(); 