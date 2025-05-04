"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.getUser = exports.createUser = void 0;
const User_1 = require("../models/User");
const errorHandler_1 = require("../middleware/errorHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (req, res, next) => {
    try {
        const { Username, Email, Password } = req.body;
        // Check if username or email already exists
        const existingUser = await User_1.User.findOne({
            $or: [
                { Username: Username },
                { Email: Email }
            ]
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('Username or email already exists', 400);
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(Password, saltRounds);
        const now = new Date();
        const user = await User_1.User.create({
            Username,
            Email,
            PasswordHash: hashedPassword,
            CreatedAt: now,
            UpdatedAt: now,
            isActive: true,
            lastLogin: null,
            preferences: {
                theme: "light",
                notifications: true
            },
            profile: {
                firstName: "",
                lastName: "",
                bio: "",
                avatar: ""
            },
            role: "user",
            stats: {
                quizzesTaken: 0,
                quizzesPassed: 0,
                averageScore: 0
            },
            timestamp: now
        });
        // Remove password hash from response
        const userResponse = user.toObject();
        delete userResponse.PasswordHash;
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: userResponse
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const getUser = async (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'Get user endpoint' });
};
exports.getUser = getUser;
const loginUser = async (req, res, next) => {
    try {
        const { Username, Password } = req.body;
        // Find user by username
        const user = await User_1.User.findOne({ Username });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid username or password', 401);
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(Password, user.PasswordHash);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError('Invalid username or password', 401);
        }
        // Update last login
        const now = new Date();
        await User_1.User.updateOne({ _id: user._id }, {
            $set: {
                lastLogin: now,
                UpdatedAt: now
            }
        });
        // Create response without password hash
        const userResponse = user.toObject();
        delete userResponse.PasswordHash;
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: userResponse
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
