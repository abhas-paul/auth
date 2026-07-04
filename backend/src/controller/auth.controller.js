import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
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

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = new Session({ user: user._id, refreshToken: refreshTokenHash, ip: req.ip, userAgent: req.headers["user-agent"] });
    await session.save();

    const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, config.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ message: "User registered successfully", user: { id: user._id, username: user.username, email: user.email }, token: accessToken });

};

async function login(req, res) {

};

async function logout(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await Session.findOne({ refreshToken: refreshTokenHash, revoked: false });

    if (!session) {
        return res.status(400).json({ message: "Invalid refresh token" });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out successfully" });

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

async function refreshToken(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await Session.findOne({ refreshToken: refreshTokenHash, revoked: false });

    if (!session) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, { expiresIn: "15m" });

    const newRefreshToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, { expiresIn: "7d" });

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshToken = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Access token refreshed", token: accessToken });

};

export { register, login, logout, me, refreshToken };