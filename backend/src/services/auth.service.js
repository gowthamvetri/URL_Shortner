import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev';
const JWT_EXPIRES_IN = '7d';

const registerUser = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  // Create user
  const newUser = await User.create({
    name,
    email,
    passwordHash,
    verificationCode,
    verificationCodeExpires,
    isVerified: false
  });

  // Attempt to send email, but don't fail registration if email fails (fallback to console in dev)
  try {
    await sendVerificationEmail(email, verificationCode, name);
  } catch (emailError) {
    console.error('Failed to dispatch email, but user was created.');
  }

  // Generate token
  const token = generateToken(newUser._id);

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isVerified: newUser.isVerified,
      phoneNumber: newUser.phoneNumber
    },
    token,
  };
};

const loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      phoneNumber: user.phoneNumber
    },
    token,
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, name, phoneNumber) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.name = name;
  user.phoneNumber = phoneNumber;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      phoneNumber: user.phoneNumber
    }
  };
};

const requestPasswordChangeOTP = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Generate new code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  user.passwordResetCode = resetCode;
  user.passwordResetCodeExpires = resetCodeExpires;
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, resetCode, user.name);
  } catch (emailError) {
    const error = new Error('Failed to send password reset email. Please try again later.');
    error.statusCode = 500;
    throw error;
  }

  return { message: 'Password reset code sent to your email' };
};

const changePassword = async (userId, newPassword, otpCode) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user.passwordResetCode || user.passwordResetCode !== otpCode) {
    const error = new Error('Invalid verification code');
    error.statusCode = 400;
    throw error;
  }

  if (user.passwordResetCodeExpires < new Date()) {
    const error = new Error('Verification code has expired');
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  user.passwordHash = passwordHash;
  // Clear the reset code
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  await user.save();
  
  return { message: 'Password updated successfully' };
};

const verifyEmail = async (userId, code) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error('User is already verified');
    error.statusCode = 400;
    throw error;
  }

  if (!user.verificationCode || user.verificationCode !== code) {
    const error = new Error('Invalid verification code');
    error.statusCode = 400;
    throw error;
  }

  if (user.verificationCodeExpires < new Date()) {
    const error = new Error('Verification code has expired');
    error.statusCode = 400;
    throw error;
  }

  // Success
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return { message: 'Email verified successfully' };
};

const resendVerificationCode = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error('User is already verified');
    error.statusCode = 400;
    throw error;
  }

  // Generate new code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  user.verificationCode = verificationCode;
  user.verificationCodeExpires = verificationCodeExpires;
  await user.save();

  try {
    await sendVerificationEmail(user.email, verificationCode, user.name);
  } catch (emailError) {
    const error = new Error('Failed to send email. Please try again later.');
    error.statusCode = 500;
    throw error;
  }

  return { message: 'Verification code sent' };
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export {
  registerUser,
  loginUser,
  getUserById,
  requestPasswordChangeOTP,
  changePassword,
  generateToken,
  verifyEmail,
  resendVerificationCode,
  updateProfile
};
