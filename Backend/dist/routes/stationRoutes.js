"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const stationController_1 = require("../controllers/stationController");
const router = express_1.default.Router();
router
    .route('/')
    .get(stationController_1.getAllStations)
    .post(stationController_1.createStation);
router
    .route('/:id')
    .get(stationController_1.getStation)
    .patch(stationController_1.updateStation)
    .delete(stationController_1.deleteStation);
exports.stationRoutes = router;
