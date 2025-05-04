import mongoose from 'mongoose';

const steamMediaSchema = new mongoose.Schema({
  AppID: { type: Number, required: true },
  HeaderImage: { type: String },
  Screenshots: { type: String }, // Stored as stringified JSON
  Background: { type: String },
  Movies: { type: String } // Stored as stringified JSON or null
}, {
  collection: 'steam_media' // Explicitly specify the collection name
});

export const SteamMedia = mongoose.model('steam_media', steamMediaSchema); 