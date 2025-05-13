import express from 'express';
import { getFeedback, createFeedback } from '../controllers/feedbackController';

const router = express.Router();


router.get('/', getFeedback);


router.post('/', createFeedback);

export const feedbackRoutes = router; 