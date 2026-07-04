import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import OTP from "../models/OTP.model.js";

import config from "../config/config.js";

import { sendEmail } from "../services/email.service.js";
import { generateOTP, otpTemplate } from "../utils/utils.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function register(req, res) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
    };

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const otp = generateOTP();
    const htnlTemplate = otpTemplate(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDocument = new OTP({
        email,
        user: user._id,
        otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await otpDocument.save();

    try {
        await sendEmail(email, "Verify your account", htnlTemplate);
    } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
    }

    res.status(201).json({ message: "User registered successfully", user: { id: user._id, username: user.username, email: user.email, verified: user.verified } });

};

async function login(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.verified) {
        return res.status(403).json({ message: "Account not verified. Please verify your account before logging in." });
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const isPasswordValid = user.password === hashedPassword;

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = new Session({ user: user._id, refreshToken: refreshTokenHash, ip: req.ip, userAgent: req.headers["user-agent"] });
    await session.save();

    const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, config.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({ message: "User logged in successfully", user: { id: user._id, username: user.username, email: user.email }, token: accessToken });

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

    res.clearCookie("refreshToken", { httpOnly: true, secure: cookieOptions.secure, sameSite: cookieOptions.sameSite });
    res.status(200).json({ message: "User logged out successfully" });

};

async function logoutAll(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    await Session.updateMany({ user: decoded.id, revoked: false }, { revoked: true });

    res.clearCookie("refreshToken", { httpOnly: true, secure: cookieOptions.secure, sameSite: cookieOptions.sameSite });
    res.status(200).json({ message: "User logged out from all sessions successfully" });

};

async function me(req, res) {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    };

    let decoded;

    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found", user: { id: user._id, username: user.username, email: user.email } });

};

async function refreshToken(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

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

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    res.status(200).json({ message: "Access token refreshed", token: accessToken });

};

async function verifyOTP(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDocument = await OTP.findOne({ email, otpHash, expiresAt: { $gt: new Date() } });

    if (!otpDocument) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark the user as verified
    const user = await User.findOne({ email });
    if (user) {
        user.verified = true;
        await user.save();
    }

    // Delete the OTP document
    await OTP.deleteMany({ user: otpDocument.user });

    res.status(200).json({ message: "OTP verified successfully" });
};

export { register, login, logout, me, refreshToken, logoutAll, verifyOTP };