import mongoose from 'mongoose';
import { Game } from '../models/Game';
import dotenv from 'dotenv';

dotenv.config();

const checkGameInfo = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gamegenome:gamegenome@cluster0.qvgxwz7.mongodb.net/gamegenome?retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const appIds = ['26900', '255710', '2820'];
    
    for (const appId of appIds) {
      const game = await Game.findOne({ AppID: parseInt(appId) });
      if (game) {
        console.log(`\nGame found for AppID ${appId}:`);
        console.log('Name:', game.Name);
        console.log('HeaderImage:', game.HeaderImage);
      } else {
        console.log(`\nNo game found for AppID ${appId}`);
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkGameInfo(); 