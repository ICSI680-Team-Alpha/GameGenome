import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { stationRoutes } from './routes/stationRoutes';
import { gameRoutes } from './routes/gameRoutes';
import { feedbackRoutes } from './routes/feedbackRoutes';
import { quizRoutes } from './routes/quizRoutes';
import { recommendationRoutes } from './routes/recommendationRoutes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';
import { connectDB } from './db/mongoose';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stations', stationRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error handling
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 