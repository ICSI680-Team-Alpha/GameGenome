"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecommendations = exports.getRecommendations = void 0;
const Recommendation_1 = require("../models/Recommendation");
const Game_1 = require("../models/Game");
const UserQuizResponse_1 = require("../models/UserQuizResponse");
const errorHandler_1 = require("../middleware/errorHandler");
// Get recommendations for a user and station
const getRecommendations = async (req, res, next) => {
    try {
        const { userId, stationId } = req.query;
        if (!userId || !stationId) {
            return next(new errorHandler_1.AppError('User ID and Station ID are required', 400));
        }
        // First, check if we already have recommendations for this user and station
        let recommendations = await Recommendation_1.Recommendation.findOne({
            userID: userId,
            stationID: stationId
        });
        // If we don't have recommendations, generate them
        if (!recommendations) {
            // Get the user's quiz responses
            const quizResponses = await UserQuizResponse_1.UserQuizResponse.find({
                UserID: userId,
                StationID: stationId
            });
            if (!quizResponses || quizResponses.length === 0) {
                return next(new errorHandler_1.AppError('No quiz responses found for this user and station', 404));
            }
            // sample games as recommendations
            const sampleGames = await Game_1.Game.find().limit(5);
            recommendations = await Recommendation_1.Recommendation.create({
                userID: userId,
                stationID: stationId,
                recommendedGames: sampleGames
            });
        }
        res.status(200).json({
            status: 'success',
            data: recommendations
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecommendations = getRecommendations;
// Create recommendations for a user and station
const createRecommendations = async (req, res, next) => {
    try {
        const { userId, stationId } = req.body;
        if (!userId || !stationId) {
            return next(new errorHandler_1.AppError('User ID and Station ID are required', 400));
        }
        //sample games as recommendations
        const sampleGames = await Game_1.Game.find().limit(5);
        const recommendations = await Recommendation_1.Recommendation.create({
            userID: userId,
            stationID: stationId,
            recommendedGames: sampleGames
        });
        res.status(201).json({
            status: 'success',
            data: recommendations
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createRecommendations = createRecommendations;
