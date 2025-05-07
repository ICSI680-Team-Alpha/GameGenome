import mongoose from 'mongoose';

const steamMediaSchema = new mongoose.Schema({
  AppID: { type: Number, required: true },
  HeaderImage: { type: String },
  Screenshots: { type: String }, 
  Background: { type: String },
  Movies: { type: String } 
}, {
  collection: 'steam_media' 
});

export const SteamMedia = mongoose.model('steam_media', steamMediaSchema); 