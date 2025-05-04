import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  stationID: { type: String, required: true },
  userID: { type: String, required: true },
  recommendedGames: [{
    AppID: { type: Number, required: true },
    Name: { type: String, required: true },
    ReleaseDate: { type: String },
    Developer: { type: String },
    Publisher: { type: String },
    PositiveRatings: { type: Number },
    NegativeRatings: { type: Number },
    Price: { type: Number },
    HeaderImage: { type: String }
  }],
  timestamp: { type: Date, default: Date.now }
});

export const Recommendation = mongoose.model('recommendations', recommendationSchema); 