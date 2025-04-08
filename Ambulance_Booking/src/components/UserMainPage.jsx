import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import ambulanceMarkerImg from "../images/ambulanceMarker.png";
import userMarkerImg from "../images/finalfinal.png";

// Custom icons
const ambulanceIcon = new L.Icon({
  iconUrl: ambulanceMarkerImg,
  iconSize: [60, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const userIcon = new L.Icon({
  iconUrl: userMarkerImg,
  iconSize: [50, 50],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const generateNearbyAmbulances = (lat, lng, count = 5) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Available`,
    position: [
      lat + (Math.random() - 0.5) * 0.01,
      lng + (Math.random() - 0.5) * 0.01,
    ],
  }));

const SetViewToUser = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (
      coords &&
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      map.setView(coords, 15);
    }
  }, [coords, map]);
  return null;
};

const MapWithAmbulances = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [bookedAmbulanceId, setBookedAmbulanceId] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [eta, setEta] = useState(null);

  const openRouteApiKey = "5b3ce3597851110001cf624811f93877a93d448b9a0ab9a7c5e38f59";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        setAmbulances(generateNearbyAmbulances(lat, lng));
      },
      (error) => {
        console.error("Geolocation error:", error);
        const fallbackLat = 19.295;
        const fallbackLng = 72.854;
        setUserLocation([fallbackLat, fallbackLng]);
        setAmbulances(generateNearbyAmbulances(fallbackLat, fallbackLng));
      }
    );
  }, []);

  const animateAmbulance = (ambId, coords) => {
    let i = 0;
    const interval = setInterval(() => {
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === ambId && coords[i]
            ? { ...amb, position: coords[i] }
            : amb
        )
      );
      i++;
      if (i >= coords.length) {
        clearInterval(interval);
        alert("Ambulance has arrived! ✅");
        setBookedAmbulanceId(null);
        setRouteCoords([]);
        setEta(null);
      }
    }, 500); // Adjust speed here (slower = larger)
  };

  const handleBookAmbulance = async (id) => {
    const ambulance = ambulances.find((a) => a.id === id);
    if (!ambulance || !userLocation) return;

    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: openRouteApiKey,
            start: `${ambulance.position[1]},${ambulance.position[0]}`,
            end: `${userLocation[1]},${userLocation[0]}`,
          },
        }
      );

      const coords = response.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      const durationSec = response.data.features[0].properties.summary.duration;
      const etaMin = Math.round(durationSec / 60);

      setRouteCoords(coords);
      setEta(etaMin);
      setBookedAmbulanceId(id);
      animateAmbulance(id, coords);
    } catch (err) {
      console.error("Route API error:", err);
      alert("Failed to get route from OpenRouteService.");
    }
  };

  return (
    <MapContainer
      center={userLocation || [19.295, 72.854]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <SetViewToUser coords={userLocation} />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}

      {ambulances.map(
        (amb) =>
          amb.position && (
            <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
              <Popup>
                <div>
                  <strong>{amb.name}</strong>
                  <br />
                  {bookedAmbulanceId === amb.id ? (
                    <>
                      <span style={{ color: "green" }}>✅ Booked</span>
                      {eta && (
                        <>
                          <br />
                          ETA: {eta} min
                        </>
                      )}
                    </>
                  ) : (
                    <button onClick={() => handleBookAmbulance(amb.id)}>
                      Book Ambulance
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          )
      )}

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" weight={5} />
      )}
    </MapContainer>
  );
};

export default MapWithAmbulances;
