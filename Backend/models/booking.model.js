const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      default: () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let id = "EV-";
        for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
        return id;
      },
    },
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName:     { type: String, required: true },
    userEmail:    { type: String },
    stationId:    { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    stationName:  { type: String, required: true },
    stationCity:  { type: String },
    stationState: { type: String },
    chargerType:  { type: String, required: true },
    slotDate:     { type: String, required: true },   // "YYYY-MM-DD"
    slotTime:     { type: String, required: true },   // "09:00 AM"
    duration:     { type: Number, default: 1 },       // hours
    amount:       { type: Number, required: true },   // INR
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);