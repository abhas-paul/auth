import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import config from "../config/config.js";

async function register(req, res) {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
    };

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "User registered successfully", user: { id: user._id, username: user.username, email: user.email }, token });

};

async function login(req, res) {

};

async function logout(req, res) {

};

async function me(req, res) {
    
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    };

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.status(200).json({ message: "User found", user: { id: user._id, username: user.username, email: user.email } });
    
};

export { register, login, logout, me };