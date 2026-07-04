import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ["MONGODB_URI", "PORT", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cipher_db',
    PORT: Number(process.env.PORT) || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || "",
    GOOGLE_USER: process.env.GOOGLE_USER || "",
};

export default config;