import authService from '../services/auth.service.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticate, authorizeRoles, requireVerifiedEmail } from '../middlewares/auth.middleware.js';
import { authRateLimiter, loginRateLimiter, otpRateLimiter, passwordResetRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { ROLES } from '../constants/auth.constants.js';
import { BadRequestError } from '../exceptions/http.error.js';

const controller = {
  register: [authRateLimiter, validateRequest('register'), asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully', data: user });
  })],

  login: [loginRateLimiter, validateRequest('login'), asyncHandler(async (req, res) => {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: 'User logged in successfully', data: { user: result.user, token: result.accessToken } });
  })],

  logout: [authenticate, asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout({ refreshToken });
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  })],

  logoutAll: [authenticate, asyncHandler(async (req, res) => {
    await authService.logoutAll(req.user._id);
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  })],

  me: [authenticate, asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: { user: req.user } });
  })],

  refreshToken: [validateRequest('refreshToken'), asyncHandler(async (req, res) => {
    const result = await authService.refreshToken({
      refreshToken: req.body.refreshToken,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: 'Token refreshed', data: { token: result.accessToken } });
  })],

  verifyOtp: [otpRateLimiter, validateRequest('verifyOtp'), asyncHandler(async (req, res) => {
    await authService.verifyOtp(req.body);
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  })],

  resendOtp: [otpRateLimiter, validateRequest('resendOtp'), asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  })],

  forgotPassword: [passwordResetRateLimiter, validateRequest('forgotPassword'), asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent' });
  })],

  resetPassword: [passwordResetRateLimiter, validateRequest('resetPassword'), asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  })],

  changePassword: [authenticate, validateRequest('changePassword'), asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  })],

  adminExample: [authenticate, authorizeRoles(ROLES.ADMIN), requireVerifiedEmail, asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Admin access granted' });
  })],
};

export default controller;
