import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  AppID: { type: Number, required: true },
  Name: { type: String, required: true },
  ReleaseDate: { type: String, required: true },
  Developer: { type: String, required: true },
  Publisher: { type: String, required: true },
  RequiredAge: { type: Number, default: 0 },
  Achievements: { type: Number, default: 0 },
  PositiveRatings: { type: Number, default: 0 },
  NegativeRatings: { type: Number, default: 0 },
  AveragePlaytime: { type: Number, default: 0 },
  MedianPlaytime: { type: Number, default: 0 },
  owners: { type: String, default: '' },
  Price: { type: Number, default: 0 },
  OwnersMin: { type: Number, default: 0 },
  OwnersMax: { type: Number, default: 0 }
});

export const Game = mongoose.model('steam', gameSchema); 