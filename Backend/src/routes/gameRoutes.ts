import express from 'express';
import { getAllGames, getGameById } from '../controllers/gameController';

const router = express.Router();

// Get all games
router.get('/', getAllGames);

// Get game by ID
router.get('/:id', getGameById);

export const gameRoutes = router; 