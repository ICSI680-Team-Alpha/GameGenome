import express from 'express';
import { createUser, getUser, loginUser, updateUser } from '../controllers/userController';

const router = express.Router();


router.post('/signup', createUser);


router.post('/login', loginUser);


router.get('/:id', getUser);

// Update user by ID
router.patch('/:id', updateUser);

export const userRoutes = router; 