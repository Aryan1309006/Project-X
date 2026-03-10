const mongoose = require("mongoose");
const reviewSchema = require("../schemas/review.schema");

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
