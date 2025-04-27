"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const stationRoutes_1 = require("./routes/stationRoutes");
const gameRoutes_1 = require("./routes/gameRoutes");
const feedbackRoutes_1 = require("./routes/feedbackRoutes");
const quizRoutes_1 = require("./routes/quizRoutes");
const recommendationRoutes_1 = require("./routes/recommendationRoutes");
const steamMediaRoutes_1 = require("./routes/steamMediaRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const config_1 = require("./config");
const mongoose_1 = require("./db/mongoose");
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, mongoose_1.connectDB)();
const app = (0, express_1.default)();
const PORT = config_1.config.port;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/stations', stationRoutes_1.stationRoutes);
app.use('/api/games', gameRoutes_1.gameRoutes);
app.use('/api/feedback', feedbackRoutes_1.feedbackRoutes);
app.use('/api/quizzes', quizRoutes_1.quizRoutes);
app.use('/api/recommendations', recommendationRoutes_1.recommendationRoutes);
app.use('/api/media', steamMediaRoutes_1.steamMediaRoutes);
app.use('/api/users', userRoutes_1.userRoutes);
// Error handling
app.use(errorHandler_1.errorHandler);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
