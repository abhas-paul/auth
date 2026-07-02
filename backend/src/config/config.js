import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGODB_URI || !process.env.PORT) {
    throw new Error("Missing required environment variables.");
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cipher_db',
    PORT: process.env.PORT || 3000,
}

export default config;