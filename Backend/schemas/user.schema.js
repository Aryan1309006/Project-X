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

userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    const Review = require("mongoose").model("Review");
    await Review.deleteMany({ userId: user._id });
  }
  next();
});

module.exports = userSchema;
