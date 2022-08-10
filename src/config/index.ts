import dotenv from 'dotenv';
dotenv.config(); // load config vars from .env to process.env

export const env = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET || "#@Oluf-mi23#@",
  tokenExpirationInSeconds: process.env.TOKEN_EXPIRATION || 36000
};
