"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = exports.getFeedback = void 0;
const GameFeedback_1 = require("../models/GameFeedback");
const errorHandler_1 = require("../middleware/errorHandler");
const getFeedback = async (req, res, next) => {
    try {
        const { userId, stationId } = req.query;
        if (!userId || !stationId) {
            return next(new errorHandler_1.AppError('User ID and Station ID are required', 400));
        }
        const feedback = await GameFeedback_1.GameFeedback.find({
            UserID: userId,
            StationID: stationId
        });
        res.status(200).json({
            status: 'success',
            results: feedback.length,
            data: feedback
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFeedback = getFeedback;
const createFeedback = async (req, res, next) => {
    try {
        const feedback = await GameFeedback_1.GameFeedback.create(req.body);
        res.status(201).json({
            status: 'success',
            data: feedback
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createFeedback = createFeedback;
