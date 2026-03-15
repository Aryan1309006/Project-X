import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef } from "react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function MapView() {

  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {

    const lat = 19.076;
    const lng = 72.8777;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 6,
    });

    const map = mapRef.current;

    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([lng, lat])
      .addTo(map);

    map.on("load", async () => {

      try {

        const response = await fetch(
          `http://localhost:8000/api/stations/nearby?lat=${lat}&lng=${lng}&radius=5000000000`
        );

        const result = await response.json();

        const stations = result.stations;

        stations.forEach((station) => {

          const coordinates = station.location.coordinates;

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family:sans-serif">
              <h3 style="font-weight:600">${station.name}</h3>
              <p style="font-size:13px;color:gray">
                ${station.operator || "Unknown Operator"}
              </p>
              <a href="/station/${station._id}" 
                 style="color:#16a34a;font-weight:600">
                 View Details →
              </a>
            </div>
          `);

          new mapboxgl.Marker({ color: "green" })
            .setLngLat([coordinates[0], coordinates[1]])
            .setPopup(popup)
            .addTo(map);

        });

      } catch (err) {
        console.error(err);
      }

    });

  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-4">
        Location Map
      </h2>

      <div
        ref={mapContainer}
        className="w-full h-[420px] rounded-xl"
      />

    </div>
  );
}

export default MapView;
