const express = require("express");
const router = express.Router({ mergeParams: true }); // ← mergeParams for nested route
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/review.controller");
const { protect } = require("../middleware/auth");

// GET /api/stations/:stationId/reviews
router.get("/", wrapAsync(reviewController.getStationReviews));

// POST /api/stations/:stationId/reviews
router.post("/", protect, wrapAsync(reviewController.addReview));

// DELETE /api/stations/:stationId/reviews/:reviewId
router.delete("/:reviewId", protect, wrapAsync(reviewController.deleteReview));

module.exports = router;