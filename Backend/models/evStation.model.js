const mongoose = require("mongoose");
const evStationSchema = require("../schemas/evStation.schema");

const EVStation = mongoose.model("EVStation", evStationSchema);

module.exports = EVStation;
