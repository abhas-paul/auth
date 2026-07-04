import env from './env.js';

const config = {
    MONGODB_URI: env.MONGODB_URI,
    PORT: env.PORT,
    JWT_SECRET: env.JWT_SECRET,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: env.GOOGLE_USER,
};

export default config;