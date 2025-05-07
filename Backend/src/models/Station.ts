import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  stationID: { type: Number, required: true, unique: true },
  userID: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  location: {
    building: { type: String },
    room: { type: String },
    coordinates: {
      x: { type: Number },
      y: { type: Number },
      z: { type: Number }
    }
  },
  type: { 
    type: String, 
    enum: ['quiz', 'info', 'interactive'],
    default: 'quiz'
  },
  content: {
    quizID: { type: Number },
    infoText: { type: String },
    mediaUrls: [{ type: String }]
  },
  requirements: {
    minScore: { type: Number, default: 0 },
    prerequisites: [{ type: Number }] // IDs of stations that must be completed first
  },
  isActive: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
}, {
  strict: true,
  collection: 'stations'
});

// Add pre-save hook to log the station data
stationSchema.pre('save', function(next) {
  console.log('Station model: Saving station with data:', JSON.stringify(this.toObject(), null, 2));
  next();
});

// Add post-save hook to verify the save
stationSchema.post('save', function(doc) {
  console.log('Station model: Successfully saved station:', doc.stationID);
});

// Add error handling middleware
stationSchema.post('save', function(error: Error, doc: mongoose.Document, next: (error?: Error) => void) {
  if (error) {
    console.error('Station model: Error saving station:', error);
  }
  next(error);
});

export const Station = mongoose.model('Station', stationSchema); 