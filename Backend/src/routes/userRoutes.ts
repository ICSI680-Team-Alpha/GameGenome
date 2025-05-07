import express from 'express';
import { createUser, getUser, loginUser } from '../controllers/userController';

const router = express.Router();


router.post('/signup', createUser);


router.post('/login', loginUser);


router.get('/:id', getUser);

export const userRoutes = router; 