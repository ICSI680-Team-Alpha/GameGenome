"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizResponsesByUser = exports.getQuizResponseByStation = exports.saveQuizResponse = exports.getQuizzes = void 0;
const Quiz_1 = require("../models/Quiz");
const QuizResponse_1 = require("../models/QuizResponse");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const isArrayCategory = (category) => {
    return ['genre', 'platform', 'gameplay', 'story', 'graphics'].includes(category);
};
// Get all active quizzes
exports.getQuizzes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const quizzes = await Quiz_1.Quiz.find();
    res.status(200).json({
        status: 'success',
        data: quizzes
    });
});
// Save quiz response
exports.saveQuizResponse = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { userId, stationId, responses } = req.body;
    if (!userId || !stationId || !responses || !Array.isArray(responses)) {
        return next(new appError_1.AppError('Invalid quiz response data', 400));
    }
    // Initialize preferences object
    const preferences = {
        genre: [],
        platform: [],
        gameplay: []
    };
    // Process each question response and categorize selections
    responses.forEach(response => {
        if (response.category && response.selections) {
            switch (response.category.toLowerCase()) {
                case 'genre':
                    preferences.genre.push(...response.selections);
                    break;
                case 'platform':
                    preferences.platform.push(...response.selections);
                    break;
                case 'gameplay':
                    preferences.gameplay.push(...response.selections);
                    break;
                default:
                    // Skip other categories
                    break;
            }
        }
    });
    // Create new quiz response with processed preferences
    const quizResponse = await QuizResponse_1.QuizResponse.create({
        userId,
        stationId,
        responses,
        preferences
    });
    res.status(201).json({
        status: 'success',
        data: quizResponse
    });
});
// Get quiz response by station ID
exports.getQuizResponseByStation = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { stationId } = req.params;
    if (!stationId) {
        return next(new appError_1.AppError('Station ID is required', 400));
    }
    const responses = await QuizResponse_1.QuizResponse.find({ stationId }).sort('-createdAt');
    res.status(200).json({
        status: 'success',
        data: responses
    });
});
// Get quiz response by user ID
exports.getQuizResponsesByUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        return next(new appError_1.AppError('User ID is required', 400));
    }
    const responses = await QuizResponse_1.QuizResponse.find({ userId }).sort('-createdAt');
    res.status(200).json({
        status: 'success',
        data: responses
    });
});
