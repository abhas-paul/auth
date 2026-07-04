import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { ForbiddenError, UnauthorizedError } from '../exceptions/http.error.js';
import User from '../models/User.model.js';
import asyncHandler from './asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw new UnauthorizedError('Authentication token is required');
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new UnauthorizedError('User no longer exists');
  }

  req.user = user;
  next();
});

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError('Insufficient permissions'));
  }

  next();
};

export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user?.verified) {
    return next(new ForbiddenError('Email verification required'));
  }

  next();
};
