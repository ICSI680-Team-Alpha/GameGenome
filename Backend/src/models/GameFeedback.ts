import mongoose from 'mongoose';

const gameFeedbackSchema = new mongoose.Schema({
  StationID: { type: String, required: true },
  UserID: { type: String, required: true },
  rating: [{
    RatingType: { type: String, required: true },
    RatedDate: { type: Date, required: true },
    AppID: { type: String, required: true }
  }]
});

export const GameFeedback = mongoose.model('gamefeedback', gameFeedbackSchema); 