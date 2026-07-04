import { Router } from "express";
const authRouter = Router();

import { register, login, logout, me, refreshToken, logoutAll } from "../controller/auth.controller.js";

// Handle user registration logic here
authRouter.post("/register", register);

// Handle user login logic here
authRouter.post("/login", login);

// Handle user logout logic here
authRouter.post("/logout", logout);

// Handle user logout from all sessions logic here
authRouter.post("/logout-all", logoutAll);

// Handle user profile retrieval logic here
authRouter.get("/me", me);

// Handle token refresh logic here
authRouter.get("/refresh-token", refreshToken);

export default authRouter;