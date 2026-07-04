import { InternalServerError } from '../exceptions/http.error.js';

export const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    error: err.name || 'InternalServerError',
    statusCode,
  });
};

export const notFoundMiddleware = (req, res, next) => {
  next(new InternalServerError(`Route not found: ${req.originalUrl}`));
};
