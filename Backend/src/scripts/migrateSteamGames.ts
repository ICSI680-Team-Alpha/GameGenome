import mongoose from 'mongoose';
import { config } from '../config';
import { SteamGame } from '../models/SteamGame';

const migrateSteamGames = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Get the steam_info collection
    const db = mongoose.connection.db;
    const steamInfoCollection = db.collection('steam_info');

    // Get all existing games
    const existingGames = await steamInfoCollection.find({}).toArray();
    console.log(`Found ${existingGames.length} games to migrate`);

    // Update each game to match new schema
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

      // Update the game document
      await steamInfoCollection.updateOne(
        { _id: game._id },
        { $set: updatedGame },
        { upsert: true }
      );

      console.log(`Migrated game: ${game.Name}`);
    }

    console.log('Migration completed successfully');
    
    // Verify the migration
    const migratedGames = await steamInfoCollection.find({}).toArray();
    console.log('Sample migrated game:', migratedGames[0]);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

// Run the migration
migrateSteamGames(); 