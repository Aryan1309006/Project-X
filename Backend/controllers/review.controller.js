const Review = require("../models/review.model");
const EVStation = require("../models/evStation.model");
const ExpressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");

// GET all reviews for a station
module.exports.getStationReviews = async (req, res) => {
  const reviews = await Review.find({ stationId: req.params.stationId })
    .populate("userId", "name profileImage")
    .sort({ createdAt: -1 });

  const formatted = reviews.map((r) => ({
    _id: r._id,
    userName: r.userId?.name || "Anonymous",
    profileImage: r.userId?.profileImage || "https://i.pravatar.cc/300",
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  }));

  res.status(200).json({ success: true, reviews: formatted });
};

// POST a new review (logged in users only)
module.exports.addReview = async (req, res) => {
  const { stationId } = req.params;
  const { rating, comment } = req.body;

  // one review per user per station (enforced by schema index too)
  const existing = await Review.findOne({ userId: req.user.id, stationId });
  if (existing) throw new ExpressError(400, "You have already reviewed this station");

  const review = await Review.create({
    userId: req.user.id,
    stationId,
    rating,
    comment,
  });

  // recalculate averageRating + reviewCount on station
  const allReviews = await Review.find({ stationId });
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await EVStation.findByIdAndUpdate(stationId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: allReviews.length,
  });

  res.status(201).json({ success: true, review });
};

// DELETE a review (owner only)
module.exports.deleteReview = async (req, res) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.reviewId,
    userId: req.user.id,
  });

  if (!review) throw new ExpressError(404, "Review not found or not yours");

  // recalculate after delete
  const allReviews = await Review.find({ stationId: review.stationId });
  const avg = allReviews.length
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0;

  await EVStation.findByIdAndUpdate(review.stationId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: allReviews.length,
  });

  res.status(200).json({ success: true, message: "Review deleted" });
};