import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cipher_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookie-secret-change-me',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || '',
  GOOGLE_USER: process.env.GOOGLE_USER || '',
};

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];
const missing = requiredInProduction.filter((key) => env.NODE_ENV === 'production' && !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
}

export default env;
