import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGODB_URI || !process.env.PORT || !process.env.JWT_SECRET) {
    throw new Error("Missing required environment variables: MONGODB_URI, PORT, and JWT_SECRET must be set.");
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cipher_db',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
}

export default config;