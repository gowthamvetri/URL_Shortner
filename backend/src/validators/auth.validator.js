import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
    }),
});

export {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
