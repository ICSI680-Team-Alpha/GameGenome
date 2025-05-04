import express from 'express';
import { getAllMedia, getMediaByAppId } from '../controllers/steamMediaController';

const router = express.Router();

// Get all media
router.get('/', getAllMedia);

// Get media by AppID
router.get('/:id', getMediaByAppId);

export const steamMediaRoutes = router; 