import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true,
    },
    refreshToken: {
        type: String,
        required: [true, 'Refresh token is required'],
    },
    ip: {
        type: String,
        required: [true, 'IP address is required'],
    },
    userAgent: {
        type: String,
        required: [true, 'User agent is required'],
    },
    revoked: {
        type: Boolean,
        default: false,
        index: true,
    },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
    device: {
        type: String,
        default: 'unknown',
    },
}, {
    timestamps: true,
});

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;