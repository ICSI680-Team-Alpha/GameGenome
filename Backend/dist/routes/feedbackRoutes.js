"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const router = express_1.default.Router();
// Get feedback by user ID and station ID
router.get('/', feedbackController_1.getFeedback);
// Create feedback
router.post('/', feedbackController_1.createFeedback);
exports.feedbackRoutes = router;
