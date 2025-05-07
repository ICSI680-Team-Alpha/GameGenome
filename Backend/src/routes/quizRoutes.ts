import express from 'express';
import { getQuizzes, saveQuizResponse, getQuizResponseByStation, getQuizResponsesByUser } from '../controllers/quizController';

const router = express.Router();

// Get all quizzes
router.get('/', getQuizzes);

// Save quiz response
router.post('/responses', saveQuizResponse);

// Get quiz responses by station ID
router.get('/responses/station/:stationId', getQuizResponseByStation);

// Get quiz responses by user ID
router.get('/responses/user/:userId', getQuizResponsesByUser);

export const quizRoutes = router; 