import { Router } from 'express';
import {
  createAccident,
  getAccidentById,
  getRecentAccidents,
  updateAccidentStatus,
  confirmAccident,
  disputeAccident,
} from '../controllers/accidentController.js';

const router = Router();

// Routes for /api/accidents
router.route('/')
  .post(createAccident)
  .get(getRecentAccidents);

router.route('/:reportId')
  .get(getAccidentById);

router.route('/:reportId/status')
  .patch(updateAccidentStatus);

router.route('/:reportId/confirm')
  .post(confirmAccident);

router.route('/:reportId/dispute')
  .post(disputeAccident);

export default router;
