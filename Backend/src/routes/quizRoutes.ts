import express from 'express';
import { getQuizzes, saveQuizResponse, getQuizResponseByStation, getQuizResponsesByUser } from '../controllers/quizController';

const router = express.Router();


router.get('/', getQuizzes);


router.post('/responses', saveQuizResponse);


router.get('/responses/station/:stationId', getQuizResponseByStation);


router.get('/responses/user/:userId', getQuizResponsesByUser);

export const quizRoutes = router; 