import { Router } from "express";
const authRouter = Router();

import { register, login, logout } from "../controller/auth.controller.js";

// Handle user registration logic here
authRouter.post("/register", register);

// Handle user login logic here
authRouter.post("/login", login);

// Handle user logout logic here
authRouter.post("/logout", logout);

export default authRouter;