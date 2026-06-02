import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth); // Protect all analytics routes

router.get('/global', analyticsController.getGlobalAnalytics);
router.get('/:urlId', analyticsController.getAnalytics);

export default router;
