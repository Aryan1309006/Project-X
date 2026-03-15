import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StationCard from "./StationCard";

function StationList() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalStations, setTotalStations] = useState(0);

  const limit = 20;

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8000/api/stations/nearby?lat=19.076&lng=72.8777&radius=5000000&page=${page}`,
        );

        const data = await response.json();

        if (data && data.stations) {
          setStations(data.stations);
          setFilteredStations(data.stations);
          setTotalStations(data.total);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [page]);

  useEffect(() => {
    if (!search) {
      setFilteredStations(stations);
      return;
    }

    const result = stations.filter((station) =>
      station.name?.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredStations(result);
  }, [search, stations]);

  const totalPages = Math.ceil(totalStations / limit);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading charging stations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          EV Charging Stations
        </h1>

        {/* Search Bar */}

        <div className="relative mb-8 group">
          <div
            className="absolute -inset-1 rounded-xl 
                          bg-gradient-to-r from-emerald-400 to-teal-600 
                          blur opacity-30"
          ></div>

          <input
            type="text"
            placeholder="Search nearby stations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="relative w-full bg-white rounded-xl px-4 py-3 
                       border border-gray-200 outline-none"
          />
        </div>

        {/* Count */}

        <p className="text-gray-500 mb-6 text-sm">
          Showing {filteredStations.length} of {totalStations} stations
        </p>

        {/* Station Cards */}

        <div className="space-y-4">
          {filteredStations.map((station) => (
            <StationCard
              key={station._id}
              station={station}
              onClick={() => navigate(`/station/${station._id}`)}
            />
          ))}
        </div>

        {/* Pagination */}

        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border 
                       disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-600 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default StationList;
