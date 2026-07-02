const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },

    displayName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    profilePicture: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
      index: true,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
      index: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);