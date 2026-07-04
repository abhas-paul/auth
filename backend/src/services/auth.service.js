import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { AUTH_CONSTANTS } from '../constants/auth.constants.js';
import User from '../models/User.model.js';
import Session from '../models/Session.model.js';
import OTP from '../models/OTP.model.js';
import { sendEmail } from './email.service.js';
import { generateOTP, otpTemplate } from '../utils/utils.js';
import { ConflictError, UnauthorizedError, BadRequestError } from '../exceptions/http.error.js';

export class AuthService {
  async register({ username, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });

    if (existingUser) {
      throw new ConflictError('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS);
    const user = await User.create({ username, email: normalizedEmail, password: hashedPassword });

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS);
    await OTP.create({
      email: normalizedEmail,
      user: user._id,
      otpHash,
      expiresAt: new Date(Date.now() + AUTH_CONSTANTS.OTP_TTL_MS),
    });

    try {
      await sendEmail(normalizedEmail, 'Verify your account', otpTemplate(otp));
    } catch (error) {
      // Email failures should not block registration, but should be observable.
      console.error('Failed to send verification email', error);
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    };
  }

  async login({ email, password, ip, userAgent }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.verified) {
      throw new UnauthorizedError('Account not verified');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const refreshToken = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_TTL });
    const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_TTL });
    const refreshTokenHash = await bcrypt.hash(refreshToken, AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS);

    await Session.create({
      user: user._id,
      refreshToken: refreshTokenHash,
      ip,
      userAgent,
    });

    return { user: { id: user._id, username: user.username, email: user.email }, accessToken, refreshToken };
  }

  async refreshToken({ refreshToken, ip, userAgent }) {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_SECRET);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const sessions = await Session.find({ user: decoded.id, revoked: false });
    let activeSession = null;

    for (const session of sessions) {
      const matches = await bcrypt.compare(refreshToken, session.refreshToken);
      if (matches) {
        activeSession = session;
        break;
      }
    }

    if (!activeSession) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const newRefreshToken = jwt.sign({ id: decoded.id }, env.JWT_SECRET, { expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_TTL });
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS);

    activeSession.refreshToken = newRefreshTokenHash;
    activeSession.ip = ip;
    activeSession.userAgent = userAgent;
    await activeSession.save();

    const accessToken = jwt.sign({ id: decoded.id }, env.JWT_SECRET, { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_TTL });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout({ refreshToken }) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    const sessions = await Session.find({ revoked: false });
    let targetSession = null;

    for (const session of sessions) {
      const matches = await bcrypt.compare(refreshToken, session.refreshToken);
      if (matches) {
        targetSession = session;
        break;
      }
    }

    if (!targetSession) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    targetSession.revoked = true;
    await targetSession.save();
  }

  async logoutAll(userId) {
    await Session.updateMany({ user: userId, revoked: false }, { revoked: true });
  }

  async verifyOtp({ email, otp }) {
    const normalizedEmail = email.toLowerCase().trim();
    const otpDocuments = await OTP.find({ email: normalizedEmail, expiresAt: { $gt: new Date() } });

    let otpDocument = null;
    for (const document of otpDocuments) {
      const matches = await bcrypt.compare(otp, document.otpHash);
      if (matches) {
        otpDocument = document;
        break;
      }
    }

    if (!otpDocument) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    await User.updateOne({ _id: otpDocument.user }, { verified: true });
    await OTP.deleteMany({ user: otpDocument.user });
  }
}

export default new AuthService();
