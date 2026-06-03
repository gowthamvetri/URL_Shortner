import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema, changePasswordSchema, updateProfileSchema } from '../validators/auth.validator.js';

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password } = value;
    const result = await authService.registerUser(name, email, password);

    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    const result = await authService.loginUser(email, password);

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is set by the requireAuth middleware
    const user = await authService.getUserById(req.user.id);
    return res.status(200).json({ user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const requestPasswordChangeOTP = async (req, res) => {
  try {
    const result = await authService.requestPasswordChangeOTP(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { otpCode, newPassword } = value;
    const result = await authService.changePassword(req.user.id, newPassword, otpCode);

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Verification code is required' });
    }

    const result = await authService.verifyEmail(req.user.id, code);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const result = await authService.resendVerificationCode(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, phoneNumber } = value;
    const result = await authService.updateProfile(req.user.id, name, phoneNumber);

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

export {
  register,
  login,
  getMe,
  requestPasswordChangeOTP,
  changePassword,
  verifyEmail,
  resendVerificationCode,
  updateProfile
};
