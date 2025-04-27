"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameById = exports.getAllGames = void 0;
const Game_1 = require("../models/Game");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllGames = async (req, res, next) => {
    try {
        const games = await Game_1.Game.find();
        res.status(200).json({
            status: 'success',
            results: games.length,
            data: games
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllGames = getAllGames;
const getGameById = async (req, res, next) => {
    try {
        const game = await Game_1.Game.findOne({ AppID: req.params.id });
        if (!game) {
            return next(new errorHandler_1.AppError('No game found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: game
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getGameById = getGameById;
