import express from 'express';
import {
  createStation,
  getAllStations,
  getStation,
  updateStation,
  deleteStation
} from '../controllers/stationController';
import { protect } from '../middleware/auth';

const router = express.Router();


router.use(protect);

router
  .route('/')
  .get(getAllStations)
  .post(createStation);

router
  .route('/:id')
  .get(getStation)
  .patch(updateStation)
  .delete(deleteStation);

export const stationRoutes = router; 