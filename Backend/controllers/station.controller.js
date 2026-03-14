const EVStation = require("../models/evStation.model");
const expressError = require("../utils/expressError");

module.exports.getNearbyStations = async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;

  if (!lat || !lng) {
    throw new expressError(400, "Latitude and longitude are required");
  }

  const stations = await EVStation.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius),
      },
    },
  }).limit(200);

  res.status(200).json({
    success: true,
    count: stations.length,
    stations,
  });
};
