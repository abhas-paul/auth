import { Router } from 'express';
import controller from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', ...controller.register);
authRouter.post('/login', ...controller.login);
authRouter.post('/logout', ...controller.logout);
authRouter.post('/logout-all', ...controller.logoutAll);
authRouter.get('/me', ...controller.me);
authRouter.post('/refresh-token', ...controller.refreshToken);
authRouter.post('/verify-otp', ...controller.verifyOtp);
authRouter.post('/resend-otp', ...controller.resendOtp);
authRouter.post('/forgot-password', ...controller.forgotPassword);
authRouter.post('/reset-password', ...controller.resetPassword);
authRouter.post('/change-password', ...controller.changePassword);
authRouter.get('/admin-example', ...controller.adminExample);

export default authRouter;