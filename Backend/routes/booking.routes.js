const express  = require("express");
const router   = express.Router();
const ctrl     = require("../controllers/booking.controller");
const { protect } = require("../middleware/auth"); // same middleware you use elsewhere

router.post("/",        protect, ctrl.createBooking);
router.get("/my",       protect, ctrl.getMyBookings);
router.put("/:id/pay",  protect, ctrl.confirmPayment);
router.delete("/:id",   protect, ctrl.cancelBooking);

module.exports = router;