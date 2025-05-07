import mongoose from 'mongoose';
import { Station } from '../models/Station';
import { config } from '../config';

async function migrateStations() {
  try {
    
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    
    const stations = await Station.find({ userID: { $exists: false } });
    console.log(`Found ${stations.length} stations without userID`);

    
    for (const station of stations) {
      console.log(`Updating station ${station._id}`);
      station.userID = 'default-user'; 
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