const Booking = require("../models/booking.model");

// ── shared helper — works with both req.user._id and req.user.id ─────────────
const getUserId = (req) => req.user?._id || req.user?.id;

// ── POST /api/bookings ────────────────────────────────────────────────────────
module.exports.createBooking = async (req, res) => {
  try {
    const {
      stationId, stationName, stationCity, stationState,
      chargerType, slotDate, slotTime, duration, amount,
    } = req.body;
    
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized. Please log in again." });
    const userName = req.user?.name || req.user?.userName || "User";

    if (!stationId || !chargerType || !slotDate || !slotTime || !duration || !amount) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    const clash = await Booking.findOne({
      userId, stationId, slotDate, slotTime,
      paymentStatus: { $ne: "cancelled" },
    });
    if (clash) {
      return res.status(409).json({
        message: "You already have a booking at this station for that date and time.",
      });
    }

    const booking = await Booking.create({
      userName,
      userId,
      stationId,
      stationName,
      stationCity:  stationCity  || "",
      stationState: stationState || "",
      chargerType,
      slotDate,
      slotTime,
      duration,
      amount,
    });

    res.status(201).json({ message: "Booking confirmed.", booking });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── PUT /api/bookings/:id/pay ─────────────────────────────────────────────────
module.exports.confirmPayment = async (req, res) => {
  try {
    const userId  = getUserId(req);
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "This booking is already paid." });
    }

    booking.paymentStatus = "paid";
    booking.paymentMethod = req.body.paymentMethod || "UPI";
    booking.paidAt        = new Date();
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    console.error("confirmPayment error:", err);
    res.status(500).json({ message: "Payment confirmation failed." });
  }
};

// ── GET /api/bookings/my ──────────────────────────────────────────────────────
module.exports.getMyBookings = async (req, res) => {
  try {
    const userId   = getUserId(req);
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// ── DELETE /api/bookings/:id ──────────────────────────────────────────────────
module.exports.cancelBooking = async (req, res) => {
  try {
    const userId  = getUserId(req);
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Cannot cancel a paid booking." });
    }

    booking.paymentStatus = "cancelled";
    await booking.save();
    res.json({ success: true, message: "Booking cancelled." });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({ message: "Cancellation failed." });
  }
};
