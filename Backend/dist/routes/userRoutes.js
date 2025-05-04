"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Create a new user
router.post('/signup', userController_1.createUser);
// Login user
router.post('/login', userController_1.loginUser);
// Get user by ID
router.get('/:id', userController_1.getUser);
exports.userRoutes = router;
