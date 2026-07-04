import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    otpHash: {
        type: String,
        required: [true, 'OTP hash is required'],
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration time is required'],
        index: { expireAfterSeconds: 0 },
    },
    attempts: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;