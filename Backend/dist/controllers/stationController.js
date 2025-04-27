"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStation = exports.updateStation = exports.getStation = exports.getAllStations = exports.createStation = void 0;
const Station_1 = require("../models/Station");
const errorHandler_1 = require("../middleware/errorHandler");
const createStation = async (req, res, next) => {
    try {
        console.log('Backend: Creating station with data:', req.body);
        const station = await Station_1.Station.create(req.body);
        console.log('Backend: Station created successfully:', station);
        res.status(201).json({
            status: 'success',
            data: station
        });
    }
    catch (error) {
        console.error('Backend: Error creating station:', error);
        next(error);
    }
};
exports.createStation = createStation;
const getAllStations = async (req, res, next) => {
    try {
        const stations = await Station_1.Station.find().sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: stations.length,
            data: stations
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllStations = getAllStations;
const getStation = async (req, res, next) => {
    try {
        const station = await Station_1.Station.findById(req.params.id);
        if (!station) {
            return next(new errorHandler_1.AppError('No station found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: station
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStation = getStation;
const updateStation = async (req, res, next) => {
    try {
        const station = await Station_1.Station.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!station) {
            return next(new errorHandler_1.AppError('No station found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: station
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStation = updateStation;
const deleteStation = async (req, res, next) => {
    try {
        const station = await Station_1.Station.findByIdAndDelete(req.params.id);
        if (!station) {
            return next(new errorHandler_1.AppError('No station found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteStation = deleteStation;
