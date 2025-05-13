import mongoose from 'mongoose';

const steamGameSchema = new mongoose.Schema({
  AppID: { type: Number, required: true },
  Name: { type: String, required: true },
  Categories: { type: String },
  Genres: { type: String },
  Tags: { type: String },
  owners: { type: String },
  HeaderImage: { type: String },
  Screenshots: { type: String }, 
  Background: { type: String }
}, {
  collection: 'steam_info', 
  timestamps: true 
});

export const SteamGame = mongoose.model('steam_info', steamGameSchema); 