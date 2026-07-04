# 🔐 auth Backend

This backend was built as a learning-focused project to understand how authentication works end to end in a real Node.js + Express + MongoDB application.

The main goal was not just to build features, but to study and learn the full authentication flow clearly: user registration, OTP-based verification, login, session handling, refresh tokens, logout, and protected user access.

---

## 🎯 Learning Goal

The purpose of this project is to study and understand:

- 🧠 how user accounts are created and stored
- 🔒 how passwords are hashed and compared
- 🪪 how JWT access tokens and refresh tokens work
- 🗂️ how sessions are tracked securely
- 📧 how OTP verification can be added to a signup flow
- 🛡️ how protected routes are handled with auth middleware concepts
- 🏗️ how a simple production-style backend is organized

---

## ✅ What I Implemented

### Authentication features
- 👤 User registration
- 📧 Email-based OTP verification flow
- 🔑 User login
- 🔄 Refresh token generation and rotation
- 🧾 Session creation and tracking
- 🚪 Logout and logout-from-all-sessions support
- 🧑‍💻 Protected profile retrieval via token-based access

### Backend structure
- ⚙️ Express app setup
- 🛣️ Route organization for auth endpoints
- 🗄️ Mongoose models for users, sessions, and OTPs
- 🌍 Config management using environment variables
- 📬 Email service integration for verification emails

---

## 📁 Project Structure

```text
backend/
├── server.js
├── package.json
├── .env
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── config.js
│   │   └── db.js
│   ├── controller/
│   │   └── auth.controller.js
│   ├── models/
│   │   ├── OTP.model.js
│   │   ├── Session.model.js
│   │   └── User.model.js
│   ├── routes/
│   │   └── auth.route.js
│   ├── services/
│   │   └── email.service.js
│   └── utils/
│       └── utils.js
```

---

## 🔄 Authentication Flow

### 1. Registration
- 📝 A new user submits username, email, and password.
- 🔐 The password is hashed.
- 🗃️ A new user record is created.
- 🎟️ An OTP is generated and stored temporarily.
- 📤 A verification email is sent.

### 2. OTP Verification
- 📩 The user receives an OTP by email.
- ✅ The OTP is checked against the stored hash.
- 🔓 If valid, the account is marked as verified.

### 3. Login
- 📥 The user submits email and password.
- 🔍 The password is checked.
- ✅ If valid and verified, a refresh token and access token are created.
- 🧾 A session is stored for tracking.

### 4. Token Handling
- 🎫 Access token is used for protected requests.
- 🍪 Refresh token is stored securely in a cookie and used to renew access tokens.

### 5. Logout
- 🚪 The current session can be revoked.
- 🔄 All sessions can also be revoked in one action.

---

## 🌐 API Endpoints

### Auth routes
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/logout-all
- GET /auth/me
- GET /auth/refresh-token
- POST /auth/verify-otp

---

## ⚙️ Environment Variables

Create a .env file with values similar to:

```env
MONGODB_URI=mongodb://localhost:27017/auth_db
PORT=3000
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
GOOGLE_USER=your-email@gmail.com
```

---

## ▶️ How to Run

```bash
cd backend
pnpm install
pnpm dev
```

---

## 📈 Learning Progress

This project is currently being developed as an educational auth backend. The progress below reflects the work completed so far.

### Progress Bar

```text
[███████████████████████░] 85%
```

### Completed learning areas
- ✅ Basic Express server setup
- ✅ Routing structure for auth endpoints
- ✅ User model and schema design
- ✅ Session model and token persistence
- ✅ JWT generation and verification
- ✅ OTP-based account verification flow
- ✅ Email sending integration
- ✅ Protected user profile access flow

### Still to improve
- 🔄 Add input validation middleware
- 🔄 Improve password hashing using bcrypt/argon2
- 🔄 Add centralized error handling
- 🔄 Add tests for auth flows
- 🔄 Add role-based access control concepts
- 🔄 Improve production security practices

---

## ✨ Notes

This project is a strong starting point for learning authentication in a practical way. It shows the core ideas behind modern auth systems without going too far into enterprise complexity.

The main focus was to understand how the pieces connect together:

- request → controller → model → database → response
- token generation and verification
- session lifecycle management
- email verification flow

---

## 🧾 Summary

This backend demonstrates a simple but meaningful authentication system built for learning. The goal was to study the entire auth logic from scratch and make the flow understandable, organized, and easy to extend.
