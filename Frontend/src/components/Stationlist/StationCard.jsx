import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faLocationDot,
  faPlug,
  faChevronRight,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

function StationCard({ station, onClick }) {
  const city = station?.address?.city || "Unknown city";
  const state = station?.address?.state || "";
  const stationName = station?.name || "EV Charging Station";
  const operator = station?.operator || null;
  const chargers = station?.chargers || [];
  const chargerCount = chargers.length;

  // Unique charger types summary
  const chargerTypes = [
    ...new Set(chargers.map((c) => c.type).filter(Boolean)),
  ];

  // Total ports
  const totalPorts = chargers.reduce((sum, c) => sum + (c.ports || 1), 0);

  // Highest power
  const maxPower = chargers.length
    ? Math.max(...chargers.map((c) => c.power || 0))
    : null;

  const typeColors = {
    CCS: "bg-blue-50 border-blue-100 text-blue-600",
    CCS2: "bg-blue-50 border-blue-100 text-blue-600",
    CHAdeMO: "bg-orange-50 border-orange-100 text-orange-600",
    Type2: "bg-purple-50 border-purple-100 text-purple-600",
    AC: "bg-teal-50 border-teal-100 text-teal-600",
    DC: "bg-emerald-50 border-emerald-100 text-emerald-600",
  };

  return (
    <div onClick={onClick} className="relative group cursor-pointer">
      {/* Gradient hover glow */}
      <div
        className="absolute -inset-0.5 rounded-2xl
                      bg-gradient-to-r from-emerald-400 to-teal-500
                      blur-md opacity-0 group-hover:opacity-20
                      transition-all duration-500 ease-in-out"
      />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl border border-gray-200
                      px-5 py-4 shadow-sm
                      group-hover:shadow-xl group-hover:shadow-emerald-100/60
                      group-hover:border-emerald-200
                      group-hover:-translate-y-0.5
                      transition-all duration-300 ease-in-out overflow-hidden"
      >
        {/* Sweep bar bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
          <div
            className="h-full w-0 group-hover:w-full
                          bg-gradient-to-r from-emerald-400 to-teal-500
                          transition-all duration-500 ease-in-out"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="relative shrink-0">
            <div
              className="absolute inset-0 rounded-xl bg-emerald-300/30
                            blur-md scale-90
                            opacity-0 group-hover:opacity-100
                            transition-all duration-300"
            />
            <div
              className="relative w-13 h-13 w-12 h-12 rounded-xl
                            bg-emerald-50 border border-emerald-100
                            group-hover:bg-emerald-100 group-hover:border-emerald-200
                            group-hover:scale-110 group-hover:rotate-3
                            flex items-center justify-center
                            transition-all duration-300"
            >
              <FontAwesomeIcon
                icon={faBolt}
                className="text-emerald-500 text-base
                           group-hover:text-emerald-600
                           transition-colors duration-300"
              />
            </div>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            {/* Name + arrow */}
            <div className="flex items-center justify-between gap-2">
              <h2
                className="text-sm font-semibold text-gray-900 truncate
                             group-hover:text-emerald-600
                             transition-colors duration-300"
              >
                {stationName}
              </h2>
              <div
                className="shrink-0 w-6 h-6 rounded-lg
                              bg-gray-50 border border-gray-100
                              group-hover:bg-emerald-500 group-hover:border-emerald-500
                              flex items-center justify-center
                              group-hover:translate-x-0.5
                              transition-all duration-300"
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-300 text-[9px]
                             group-hover:text-white
                             transition-colors duration-300"
                />
              </div>
            </div>

            {/* Operator */}
            {operator && (
              <p
                className="text-gray-400 text-xs flex items-center gap-1.5 mt-0.5
                            group-hover:text-gray-500 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-[9px] text-gray-300"
                />
                {operator}
              </p>
            )}

            {/* Location */}
            <p
              className="text-gray-400 text-xs flex items-center gap-1.5 mt-0.5
                          group-hover:text-gray-500 transition-colors duration-200"
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-emerald-400 text-[10px] shrink-0
                           group-hover:text-emerald-500 transition-colors duration-200"
              />
              <span className="truncate">
                {city}
                {state && `, ${state}`}
              </span>
            </p>

            {/* Bottom row */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {/* Charger type pills */}
              {chargerTypes.slice(0, 3).map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md
                              border text-[10px] font-semibold tracking-wide
                              transition-all duration-300
                              ${typeColors[type] || "bg-gray-50 border-gray-100 text-gray-500"}`}
                >
                  {type}
                </span>
              ))}

              {chargerTypes.length > 3 && (
                <span className="text-[10px] text-gray-400 font-medium">
                  +{chargerTypes.length - 3} more
                </span>
              )}

              {/* Divider */}
              {chargerTypes.length > 0 && (
                <span className="w-1 h-1 rounded-full bg-gray-200" />
              )}

              {/* Max power */}
              {maxPower > 0 && (
                <span
                  className="inline-flex items-center gap-1 text-[10px]
                                 font-semibold text-amber-600
                                 bg-amber-50 border border-amber-100
                                 px-2 py-0.5 rounded-md
                                 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faBolt} className="text-[8px]" />
                  {maxPower} kW
                </span>
              )}

              {/* Port count */}
              <span
                className="inline-flex items-center gap-1 text-[10px]
                               font-semibold text-emerald-600
                               bg-emerald-50 border border-emerald-100
                               px-2 py-0.5 rounded-md ml-auto
                               group-hover:bg-emerald-100 group-hover:border-emerald-200
                               transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {totalPorts} port{totalPorts !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationCard;
