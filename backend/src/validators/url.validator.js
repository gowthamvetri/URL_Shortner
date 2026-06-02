import Joi from 'joi';

const createUrlSchema = Joi.object({
  originalUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required()
    .messages({
      'string.uri': 'Original URL must be a valid http or https URI',
      'any.required': 'Original URL is required'
    }),
  customAlias: Joi.string().alphanum().min(3).max(30).optional().allow(''),
  expiryDate: Joi.date().greater('now').optional().allow(null),
});

const updateUrlSchema = Joi.object({
  originalUrl: Joi.string().uri({ scheme: ['http', 'https'] }).optional(),
  expiryDate: Joi.date().greater('now').optional().allow(null),
  isActive: Joi.boolean().optional(),
}).min(1);

const bulkCreateUrlSchema = Joi.array().items(createUrlSchema).min(1).max(100);

export {
  createUrlSchema,
  updateUrlSchema,
  bulkCreateUrlSchema,
};
