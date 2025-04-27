import express from 'express';
import { createUser, getUser, loginUser } from '../controllers/userController';

const router = express.Router();

// Create a new user
router.post('/signup', createUser);

// Login user
router.post('/login', loginUser);

// Get user by ID
router.get('/:id', getUser);

export const userRoutes = router; 