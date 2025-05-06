import express from 'express';
import { getFavorites, removeFavorite } from '../controllers/favoriteController';

const router = express.Router();

router.get('/', getFavorites);       
router.patch('/:id', removeFavorite); 
export const favoriteRoute = router; 