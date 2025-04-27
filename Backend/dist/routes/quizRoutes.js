"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const quizController_1 = require("../controllers/quizController");
const router = express_1.default.Router();
// Get all quizzes
router.get('/', quizController_1.getAllQuizzes);
// Get quiz by ID
router.get('/:id', quizController_1.getQuizById);
// Save quiz response
router.post('/responses', quizController_1.saveQuizResponse);
exports.quizRoutes = router;
