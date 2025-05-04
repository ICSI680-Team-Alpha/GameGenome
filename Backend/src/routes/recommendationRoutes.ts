import express from 'express';
import { getRecommendations, createRecommendations } from '../controllers/recommendationController';

const router = express.Router();

// Get recommendations for a user and station
router.get('/', getRecommendations);

// Create recommendations for a user and station
router.post('/', createRecommendations);

export const recommendationRoutes = router; 