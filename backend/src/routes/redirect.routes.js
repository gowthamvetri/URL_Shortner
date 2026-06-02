import express from 'express';
import * as redirectController from '../controllers/redirect.controller.js';

const router = express.Router();

router.get('/:shortCode', redirectController.handleRedirect);

export default router;
