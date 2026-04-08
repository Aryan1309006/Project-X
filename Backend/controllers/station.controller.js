const EVStation = require("../models/evStation.model");
const ExpressError = require("../utils/ExpressError");

// ── GET STATION BY ID ──
module.exports.getStationById = async (req, res) => {
  const station = await EVStation.findById(req.params.id)
    .populate("createdBy", "name email")
    .select("-__v");
  if (!station) throw new ExpressError(404, "Station not found");
  res.status(200).json({ success: true, station });
};

// ── GET ALL STATIONS FOR MAP ──
module.exports.getAllStationsForMap = async (req, res) => {
  const { lat, lng, radius = 200000 } = req.query;
  const filter = lat && lng
    ? {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(radius),
          },
        },
      }
    : {};
  const stations = await EVStation.find(filter)
    .select("name location address averageRating isVerified chargers operator");
  res.status(200).json({ success: true, total: stations.length, stations });
};

// ── GET ALL STATIONS WITH SEARCH + FILTERS + OPTIONAL GPS ──
module.exports.getAllStations = async (req, res) => {
  const {
    search      = "",
    chargerType = "",
    minPower    = "",
    available   = "",
    verified    = "",
    minRating   = "",
    city        = "",
    state       = "",
    sortBy      = "rating",
    lat         = "",
    lng         = "",
    radius      = "200000",
  } = req.query;

  let filter = {};

  // ── Step 1: GPS base filter (applied first if coords present) ─────
  if (lat && lng) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius),
      },
    };
  }

  // ── Step 2: Text search ───────────────────────────────────────────
  if (search.trim()) {
    filter.$or = [
      { name:            { $regex: search.trim(), $options: "i" } },
      { operator:        { $regex: search.trim(), $options: "i" } },
      { "address.city":  { $regex: search.trim(), $options: "i" } },
      { "address.state": { $regex: search.trim(), $options: "i" } },
    ];
  }

  // ── Step 3: Charger filters — $elemMatch enforces same element ────
  if (chargerType.trim() || minPower || available === "true") {
    const chargerMatch = {};
    if (chargerType.trim()) {
      chargerMatch.type = { $regex: `^${chargerType.trim()}$`, $options: "i" };
    }
    if (minPower && !isNaN(parseFloat(minPower))) {
      chargerMatch.power = { $gte: parseFloat(minPower) };
    }
    if (available === "true") {
      chargerMatch.availablePorts = { $gt: 0 };
    }
    filter.chargers = { $elemMatch: chargerMatch };
  }

  // ── Step 4: Verified boolean — strictly true ──────────────────────
  if (verified === "true") {
    filter.isVerified = true;
  }

  // ── Step 5: Min rating — strict numeric $gte ──────────────────────
  if (minRating && !isNaN(parseFloat(minRating))) {
    filter.averageRating = { $gte: parseFloat(minRating) };
  }

  // ── Step 6: City — exact match, case-insensitive ──────────────────
  if (city.trim()) {
    filter["address.city"] = { $regex: `^${city.trim()}$`, $options: "i" };
  }

  // ── Step 7: State — exact match, case-insensitive ─────────────────
  if (state.trim()) {
    filter["address.state"] = { $regex: `^${state.trim()}$`, $options: "i" };
  }

  // ── Step 8: Sort ($near already sorts by distance, override only if no GPS) ──
  const sortOption = lat && lng
    ? {}   // $near auto-sorts by proximity — don't override
    : sortBy === "newest"
      ? { createdAt: -1 }
      : { averageRating: -1 };

  const stations = await EVStation.find(filter)
    .select("name operator address location averageRating isVerified chargers status image")
    .sort(sortOption);

  res.status(200).json({ success: true, total: stations.length, stations });
};

// ── CREATE STATION ──
module.exports.createStation = async (req, res) => {
  const {
    name, description, operator,
    city, state, country,
    lat, lng,
    chargers,
    amenities,
  } = req.body;

  if (!name || !lat || !lng) {
    throw new ExpressError(400, "Name, latitude and longitude are required");
  }

  const station = await EVStation.create({
    name,
    description,
    operator,
    address: { city, state, country },
    location: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
    chargers: chargers || [],
    amenities: amenities || [],
    status: "pending",
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Station submitted for review.",
    station,
  });
};