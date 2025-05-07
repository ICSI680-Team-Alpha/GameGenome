import mongoose from 'mongoose';
import { config } from '../config';
import { SteamGame } from '../models/SteamGame';

const migrateSteamGames = async () => {
  try {
    
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    
    const db = mongoose.connection.db;
    const steamInfoCollection = db.collection('steam_info');

    
    const existingGames = await steamInfoCollection.find({}).toArray();
    console.log(`Found ${existingGames.length} games to migrate`);

    
    for (const game of existingGames) {
      const updatedGame = {
        AppID: game.AppID,
        Name: game.Name,
        Categories: game.Categories,
        Genres: game.Genres,
        Tags: game.Tags,
        owners: game.owners,
        HeaderImage: game.HeaderImage,
        Screenshots: game.Screenshots,
        Background: game.Background
      };

      
      await steamInfoCollection.updateOne(
        { _id: game._id },
        { $set: updatedGame },
        { upsert: true }
      );

      console.log(`Migrated game: ${game.Name}`);
    }

    console.log('Migration completed successfully');
    
    
    const migratedGames = await steamInfoCollection.find({}).toArray();
    console.log('Sample migrated game:', migratedGames[0]);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};


migrateSteamGames(); 