import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  BACK_PORT: Joi.number().default(3001).required(),
  NODE_ENV: Joi.string().default('prodection').required(),
  JWT_SECRET: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost').required(),
  DB_PORT: Joi.number().default(5432).required(),
});
