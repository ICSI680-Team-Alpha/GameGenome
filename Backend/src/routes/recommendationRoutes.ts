import express from 'express';
import { getRecommendations, createRecommendations } from '../controllers/recommendationController';

const router = express.Router();


router.get('/', getRecommendations);


router.post('/', createRecommendations);

export const recommendationRoutes = router; 