"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMedia = exports.getMediaByAppId = void 0;
const SteamMedia_1 = require("../models/SteamMedia");
const errorHandler_1 = require("../middleware/errorHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const getMediaByAppId = async (req, res, next) => {
    try {
        console.log('Attempting to find media for AppID:', req.params.id);
        // Add raw MongoDB query for debugging
        const rawDoc = await mongoose_1.default.connection.db.collection('steam_media')
            .findOne({ AppID: parseInt(req.params.id) });
        console.log('Raw document from MongoDB:', rawDoc);
        const media = await SteamMedia_1.SteamMedia.findOne({ AppID: parseInt(req.params.id) });
        console.log('Media found through Mongoose:', media);
        if (!media) {
            return next(new errorHandler_1.AppError('No media found for this AppID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: media
        });
    }
    catch (error) {
        console.error('Error in getMediaByAppId:', error);
        next(error);
    }
};
exports.getMediaByAppId = getMediaByAppId;
const getAllMedia = async (req, res, next) => {
    try {
        console.log('Attempting to find all media');
        // Add raw MongoDB query for debugging
        const rawDocs = await mongoose_1.default.connection.db.collection('steam_media')
            .find()
            .limit(1)
            .toArray();
        console.log('Raw sample document from MongoDB:', rawDocs[0]);
        const media = await SteamMedia_1.SteamMedia.find();
        console.log('Number of media items found through Mongoose:', media.length);
        console.log('First media item through Mongoose (if any):', media[0]);
        res.status(200).json({
            status: 'success',
            results: media.length,
            data: media
        });
    }
    catch (error) {
        console.error('Error in getAllMedia:', error);
        next(error);
    }
};
exports.getAllMedia = getAllMedia;
