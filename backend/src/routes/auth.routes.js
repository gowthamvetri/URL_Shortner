import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);
router.post('/request-password-change-otp', requireAuth, authController.requestPasswordChangeOTP);
router.post('/change-password', requireAuth, authController.changePassword);
router.post('/verify-email', requireAuth, authController.verifyEmail);
router.post('/resend-verification', requireAuth, authController.resendVerificationCode);
router.put('/profile', requireAuth, authController.updateProfile);

export default router;
