# 🔐 auth Backend

A production-oriented authentication backend built with Node.js, Express, MongoDB, and modern security practices. This project now follows a cleaner architecture with modular auth flows, strong validation, JWT-based sessions, RBAC concepts, centralized errors, and scalable structure.

---

## ✨ What This Backend Provides

### 🔐 Authentication Features
- 👤 User registration with validation and duplicate prevention
- 📧 OTP-based email verification
- 🔑 Secure login with bcrypt password verification
- ♻️ Access token and refresh token handling
- 🧾 Session storage and logout support
- 🚪 Logout from current device or all devices
- 🛡️ Protected routes with authentication middleware
- 👑 Role-based access control concepts

### 🏗️ Architecture Highlights
- 🧩 Modular controller, service, middleware, and model structure
- ✅ Request validation using Zod
- ⚠️ Centralized error handling for consistent API responses
- 🚦 Rate limiting for auth-sensitive endpoints
- 🧠 Clean separation of concerns for maintainability
- 🧪 Authentication regression tests

---

## 📁 Backend Structure

```text
backend/
├── server.js
├── package.json
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── config.js
│   │   ├── db.js
│   │   └── env.js
│   ├── constants/
│   ├── controllers/
│   ├── exceptions/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── utils/
├── tests/
└── README.md
```

---

## 🔄 Auth Flow

### 1. Registration
- 📝 User submits username, email, and password
- ✅ Input is validated
- 🔐 Password is hashed securely with bcrypt
- 🗂️ User record is stored in MongoDB
- 🎟️ OTP is generated and saved temporarily
- 📤 Verification email is sent

### 2. Email Verification
- 📩 User submits the OTP
- ✅ OTP is verified securely
- 🔓 Account is marked as verified

### 3. Login
- 📥 User submits email and password
- 🔍 Password is checked securely
- 🎫 Access and refresh tokens are issued
- 🧾 Session is created for device tracking

### 4. Protected Access
- 🛡️ Auth middleware validates the bearer token
- 👑 Roles can restrict access to admin or moderator-level features

### 5. Logout
- 🚪 Current session can be revoked
- 🔄 All sessions can be revoked together

---

## 🌐 API Endpoints

### Authentication Routes
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/logout-all
- GET /auth/me
- POST /auth/refresh-token
- POST /auth/verify-otp
- POST /auth/resend-otp
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/change-password

---

## ⚙️ Environment Variables

Create a .env file in the backend folder with values like:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cipher_db
JWT_SECRET=your-strong-secret
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
COOKIE_SECRET=your-cookie-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
GOOGLE_USER=your-email@gmail.com
```

---

## ▶️ Run Locally

```bash
cd backend
pnpm install
pnpm dev
```

---

## 🧪 Testing

Run the auth regression tests with:

```bash
cd backend
pnpm test
```

---

## 🛡️ Security Notes

This backend includes a stronger production-style security foundation:
- 🔒 bcrypt-based password hashing
- 🧱 Helmet and CORS middleware
- 🚦 Rate limiting on auth endpoints
- 🍪 Secure cookie handling
- ✅ Request validation with Zod
- 🧯 Centralized error handling

---

## 📈 Current Status

The backend has moved from a basic learning-focused auth example into a more structured, review-friendly authentication system that is much closer to production expectations.

### Progress highlights
- ✅ Modular backend structure
- ✅ Secure password handling
- ✅ JWT-based auth flow
- ✅ Validation middleware
- ✅ RBAC concepts
- ✅ Error handling
- ✅ Basic auth test coverage

---

## 💡 Summary

Cipher now has a cleaner, more maintainable authentication backend that is suitable for further scaling into a real-world SaaS-style product. It is structured for readability, extensibility, and future feature growth while keeping the core auth experience secure and professional.
