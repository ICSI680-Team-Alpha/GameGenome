"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveQuizResponse = exports.getQuizById = exports.getAllQuizzes = void 0;
const Quiz_1 = require("../models/Quiz");
const UserQuizResponse_1 = require("../models/UserQuizResponse");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz_1.Quiz.find();
        res.status(200).json({
            status: 'success',
            results: quizzes.length,
            data: quizzes
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllQuizzes = getAllQuizzes;
const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz_1.Quiz.findOne({ quizID: req.params.id });
        if (!quiz) {
            return next(new errorHandler_1.AppError('No quiz found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: quiz
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getQuizById = getQuizById;
const saveQuizResponse = async (req, res, next) => {
    try {
        if (!req.body.timestamp) {
            req.body.timestamp = new Date();
        }
        const response = await UserQuizResponse_1.UserQuizResponse.create(req.body);
        res.status(201).json({
            status: 'success',
            data: response
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveQuizResponse = saveQuizResponse;
