"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const recommendationController_1 = require("../controllers/recommendationController");
const router = express_1.default.Router();
// Get recommendations for a user and station
router.get('/', recommendationController_1.getRecommendations);
// Create recommendations for a user and station
router.post('/', recommendationController_1.createRecommendations);
exports.recommendationRoutes = router;
