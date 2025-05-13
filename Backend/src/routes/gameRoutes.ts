import express from 'express';
import { getAllGames, getGameById } from '../controllers/gameController';

const router = express.Router();


router.get('/', getAllGames);


router.get('/:id', getGameById);

export const gameRoutes = router; 