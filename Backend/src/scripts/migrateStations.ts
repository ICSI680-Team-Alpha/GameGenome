import mongoose from 'mongoose';
import { Station } from '../models/Station';
import { config } from '../config';

async function migrateStations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Get all stations without userID
    const stations = await Station.find({ userID: { $exists: false } });
    console.log(`Found ${stations.length} stations without userID`);

    // Update each station with a default userID (you should replace this with actual user IDs)
    for (const station of stations) {
      console.log(`Updating station ${station._id}`);
      station.userID = 'default-user'; // Replace with actual user ID
      await station.save();
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateStations(); 