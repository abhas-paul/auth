class HttpError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', details = null) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details = null) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details = null) {
    super(message, 403, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', details = null) {
    super(message, 409, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found', details = null) {
    super(message, 404, details);
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 422, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal server error', details = null) {
    super(message, 500, details);
  }
}

export default HttpError;
