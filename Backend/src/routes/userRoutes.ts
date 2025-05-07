import express from 'express';
import { createUser, getUser, loginUser, updateUser } from '../controllers/userController';

const router = express.Router();

// Create a new user
router.post('/signup', createUser);

// Login user
router.post('/login', loginUser);

// Get user by ID
router.get('/:id', getUser);

// Update user by ID
router.patch('/:id', updateUser);

export const userRoutes = router; 