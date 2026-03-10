const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    profileImage: {
      type: String,
      default: "https://i.pravatar.cc/300",
    },

    role: {
      type: String,
      enum: ["user", "station_owner", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = userSchema;
