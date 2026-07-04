import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";

async function register(req, res) {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
    };

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = new User.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

};

async function login(req, res) {

};

async function logout(req, res) {

};

export { register, login, logout };