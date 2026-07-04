import { ZodError } from 'zod';
import { BadRequestError, ValidationError } from '../exceptions/http.error.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const schemas = {
  register: registerSchema,
  login: loginSchema,
  verifyOtp: otpSchema,
  resendOtp: resendOtpSchema,
  refreshToken: refreshTokenSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  changePassword: changePasswordSchema,
};

export const validateRequest = (schemaName) => (req, res, next) => {
  try {
    const schema = schemas[schemaName];
    if (!schema) {
      throw new BadRequestError(`Unknown validation schema: ${schemaName}`);
    }

    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new ValidationError('Validation failed', details));
    }

    next(error);
  }
};
