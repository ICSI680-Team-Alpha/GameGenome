import express from 'express';
import { getQuizzes, saveQuizResponse } from '../controllers/quizController';

const router = express.Router();

// Get all quizzes
router.get('/', getQuizzes);

// Save quiz response
router.post('/responses', saveQuizResponse);

export const quizRoutes = router; 