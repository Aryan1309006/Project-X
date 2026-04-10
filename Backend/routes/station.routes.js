const reviewRoutes = require("./review.routes");
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const stationController = require("../controllers/station.controller");
const { protect, adminOnly, stationOwnerOnly } = require("../middleware/auth"); 

router.get("/",       wrapAsync(stationController.getAllStations)); 
router.get("/nearby", wrapAsync(stationController.getNearbyStations));
router.get("/map", wrapAsync(stationController.getAllStationsForMap));
router.post("/along-route", wrapAsync(stationController.getStationsAlongRoute));

router.use("/:stationId/reviews", reviewRoutes);

router.get("/:id", wrapAsync(stationController.getStationById));    

// station owner or admin can create
router.post("/", protect, stationOwnerOnly, wrapAsync(stationController.createStation));

router.patch("/:id/approve", protect, adminOnly, wrapAsync(stationController.approveStation));
router.patch("/:id/reject",  protect, adminOnly, wrapAsync(stationController.rejectStation));

module.exports = router;
