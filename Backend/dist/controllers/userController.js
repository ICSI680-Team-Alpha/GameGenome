"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.getUser = exports.createUser = void 0;
const createUser = async (req, res, next) => {
    res.status(201).json({ status: 'success', message: 'User creation endpoint' });
};
exports.createUser = createUser;
const getUser = async (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'Get user endpoint' });
};
exports.getUser = getUser;
const loginUser = async (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'Login endpoint' });
};
exports.loginUser = loginUser;
