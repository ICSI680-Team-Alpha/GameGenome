import express from 'express';
import { getAllQuizzes, getQuizById, saveQuizResponse } from '../controllers/quizController';

const router = express.Router();

// Get all quizzes
router.get('/', getAllQuizzes);

// Get quiz by ID
router.get('/:id', getQuizById);

// Save quiz response
router.post('/responses', saveQuizResponse);

export const quizRoutes = router; 