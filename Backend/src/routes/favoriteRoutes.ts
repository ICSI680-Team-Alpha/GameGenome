import express from 'express';
import { getFavorites } from '../controllers/favoritesController';

const router = express.Router();

router.get('/', getFavorites);

export const favoriteRoute = router; 