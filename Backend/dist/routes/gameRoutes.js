"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRoutes = void 0;
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const router = express_1.default.Router();
// Get all games
router.get('/', gameController_1.getAllGames);
// Get game by ID
router.get('/:id', gameController_1.getGameById);
exports.gameRoutes = router;
