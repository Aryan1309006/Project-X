import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faBolt,
  faClock,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import MapView from "./MapView";

function StationDetail() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchStations = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/stations/nearby?lat=19.076&lng=72.8777&radius=5000000000",
        );

        const result = await response.json();

        setStations(result.stations || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStations();
  }, []);

  const station = stations[0];

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading station...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT PANEL */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <span className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full text-sm">
            Available
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {station.name}
          </h1>

          <p className="text-gray-500 mt-2">
            Operated by {station.operator || "Unknown Operator"}
          </p>

          <div className="flex items-center gap-2 text-gray-600 mt-4">
            <FontAwesomeIcon icon={faLocationDot} />
            {station.address?.city || "Unknown location"}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            4.5 (Community rating)
          </div>

          {/* Charger summary */}

          <div className="flex items-center gap-2 mt-6 text-gray-700">
            <FontAwesomeIcon icon={faBolt} className="text-emerald-500" />
            {station.chargers?.length || 0} chargers available
          </div>

          {/* Facilities */}

          {station.facilities && (
            <div className="flex flex-wrap gap-3 mt-6">
              {station.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700"
                >
                  {facility}
                </span>
              ))}
            </div>
          )}

          {/* Chargers dynamic */}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faPlug} />
              Charging Ports
            </h2>

            <div className="space-y-4">
              {station.chargers?.map((charger, index) => (
                <div key={index} className="flex justify-between border-b pb-3">
                  <div>
                    <h3 className="font-semibold">{charger.type}</h3>
                    <p className="text-gray-500 text-sm">{charger.power} kW</p>
                  </div>

                  <span className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full text-sm">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">
          <MapView />

          {/* Reviews */}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            <div className="text-gray-500">No reviews yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationDetail;
