import express from 'express';
import { getFeedback, createFeedback } from '../controllers/feedbackController';

const router = express.Router();

// Get feedback by user ID and station ID
router.get('/', getFeedback);

// Create feedback
router.post('/', createFeedback);

export const feedbackRoutes = router; 