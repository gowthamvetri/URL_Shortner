import express from 'express';
import * as urlController from '../controllers/url.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth); // Protect all URL routes

router.post('/', urlController.createUrl);
router.post('/bulk', urlController.bulkCreateUrls);
router.get('/', urlController.getUrls);
router.get('/:id', urlController.getUrlById);
router.put('/:id', urlController.updateUrl);
router.delete('/:id', urlController.deleteUrl);

export default router;
