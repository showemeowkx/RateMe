import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  BACK_PORT_PROD: Joi.number().default(3001).required(),
  BACK_PORT_DEV: Joi.number().default(3002),
  NODE_ENV: Joi.string().default('production').required(),
  JWT_SECRET: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST_PROD: Joi.string().required(),
  DB_HOST_DEV: Joi.string(),
  DB_PORT: Joi.number().default(5432).required(),
  STRIPE_PUBLIC_KEY: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_KEY: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
