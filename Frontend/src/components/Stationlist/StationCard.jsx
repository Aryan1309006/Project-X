import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faLocationDot,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";

function StationCard({ station, onClick }) {
  const city = station?.address?.city || "Unknown city";
  const state = station?.address?.state || "";

  const charger = station?.chargers?.[0];

  const stationName = station?.name || "EV Charging Station";

  const chargerCount = station?.chargers?.length || 0;

  return (
    <div onClick={onClick} className="relative group cursor-pointer">
      {/* Gradient hover glow (landing page style) */}
      <div
        className="absolute -inset-1 rounded-2xl 
        bg-gradient-to-r from-emerald-400 to-teal-600 
        blur opacity-0 group-hover:opacity-30 
        transition duration-300"
      ></div>

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl border border-gray-200 
        p-6 shadow-sm hover:shadow-lg transition"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="bg-emerald-100 text-emerald-600 
            p-4 rounded-xl flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faBolt} />
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Station Name */}
            <h2
              className="text-lg font-semibold text-gray-900 
              group-hover:text-emerald-600 transition"
            >
              {stationName}
            </h2>

            {/* Location */}
            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
              <FontAwesomeIcon icon={faLocationDot} />
              {city}
              {state && `, ${state}`}
            </p>

            {/* Charger Info */}
            {charger && (
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-2">
                <FontAwesomeIcon icon={faPlug} />
                {charger?.type || "Standard"} • {charger?.power || "?"} kW
              </p>
            )}

            {/* Charger Count */}
            <p className="text-emerald-600 text-sm mt-3 font-medium">
              {chargerCount} charger{chargerCount !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationCard;
