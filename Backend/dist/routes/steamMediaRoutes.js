"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.steamMediaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const steamMediaController_1 = require("../controllers/steamMediaController");
const router = express_1.default.Router();
// Get all media
router.get('/', steamMediaController_1.getAllMedia);
// Get media by AppID
router.get('/:id', steamMediaController_1.getMediaByAppId);
exports.steamMediaRoutes = router;
