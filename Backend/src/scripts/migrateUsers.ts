import mongoose from 'mongoose';
import { config } from '../config';

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get all existing users
    const existingUsers = await usersCollection.find({}).toArray();
    console.log(`Found ${existingUsers.length} users to migrate`);

    // Update each user to match new schema
    for (const user of existingUsers) {
      const updatedUser = {
        userID: user.userID || parseInt(user._id.toString().slice(-6), 16), // Generate userID if not exists
        Username: user.Username,
        Email: user.Email,
        PasswordHash: user.PasswordHash,
        CreatedAt: user.CreatedAt || new Date(),
        UpdatedAt: user.UpdatedAt || new Date(),
        role: 'user',
        profile: {
          firstName: '',
          lastName: '',
          bio: '',
          avatar: ''
        },
        preferences: {
          theme: 'light',
          notifications: true
        },
        stats: {
          quizzesTaken: 0,
          quizzesPassed: 0,
          averageScore: 0
        },
        isActive: true,
        lastLogin: null,
        timestamp: user.CreatedAt || new Date()
      };

      // Update the user document
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: updatedUser },
        { upsert: true }
      );

      console.log(`Migrated user: ${user.Username}`);
    }

    console.log('Migration completed successfully');
    
    // Verify the migration
    const migratedUsers = await usersCollection.find({}).toArray();
    console.log('Sample migrated user:', migratedUsers[0]);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

// Run the migration
migrateUsers(); 