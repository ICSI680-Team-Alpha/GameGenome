import express from 'express';
import { getAllMedia, getMediaByAppId } from '../controllers/steamMediaController';

const router = express.Router();


router.get('/', getAllMedia);


router.get('/:id', getMediaByAppId);

export const steamMediaRoutes = router; 