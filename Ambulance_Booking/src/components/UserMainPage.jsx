import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDistance } from "geolib";

import ambulanceMarkerImg from "../images/ambulanceMarker.png";
import userMarkerImg from "../images/finalfinal.png"; // User icon

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

// Generate random ambulances
const generateNearbyAmbulances = (lat, lng, count = 7) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Available`,
    speedKmph: 40, // realistic average speed in city
    position: [
      lat + (Math.random() - 0.5) * 0.01,
      lng + (Math.random() - 0.5) * 0.01,
    ],
  }));

// Move the map to the user
const SetViewToUser = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 16);
  }, [coords, map]);
  return null;
};

// Estimate time in minutes
const calculateETA = (from, to, speedKmph = 40) => {
  const distanceMeters = getDistance(
    { latitude: from[0], longitude: from[1] },
    { latitude: to[0], longitude: to[1] }
  );
  const timeInMinutes = (distanceMeters / 1000 / speedKmph) * 60;
  return Math.round(timeInMinutes);
};

// Smooth movement step
const moveCloser = (from, to, step = 0.02) => {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const newLat = lat1 + (lat2 - lat1) * step;
  const newLng = lng1 + (lng2 - lng1) * step;
  return [newLat, newLng];
};

const MapWithAmbulances = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [bookedAmbulanceId, setBookedAmbulanceId] = useState(null);

  // Book an ambulance
  const handleBookAmbulance = (id) => {
    setBookedAmbulanceId(id);
    alert(`🚑 Ambulance ${id} has been booked!`);
  };

  // Get location and generate ambulances
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        setAmbulances(generateNearbyAmbulances(lat, lng));
      },
      (error) => {
        console.error("Error fetching location:", error);
        const fallbackLat = 19.295;
        const fallbackLng = 72.854;
        setUserLocation([fallbackLat, fallbackLng]);
        setAmbulances(generateNearbyAmbulances(fallbackLat, fallbackLng));
      }
    );
  }, []);

  // Animate booked ambulance movement
  useEffect(() => {
    if (!userLocation || bookedAmbulanceId === null) return;

    const interval = setInterval(() => {
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === bookedAmbulanceId
            ? { ...amb, position: moveCloser(amb.position, userLocation) }
            : amb
        )
      );
    }, 1000); // move every second

    return () => clearInterval(interval);
  }, [userLocation, bookedAmbulanceId]);

  return (
    <MapContainer
      center={userLocation || [19.295, 72.854]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User marker */}
      {userLocation && (
        <>
          <SetViewToUser coords={userLocation} />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}

      {/* Ambulances */}
      {ambulances.map((amb) => (
        <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
          <Popup>
            <div>
              <strong>{amb.name}</strong>
              <br />
              ETA:{" "}
              {userLocation
                ? `${calculateETA(amb.position, userLocation, amb.speedKmph)} min`
                : "N/A"}
              <br />
              {bookedAmbulanceId === amb.id ? (
                <span style={{ color: "green" }}>✅ Booked</span>
              ) : (
                <button onClick={() => handleBookAmbulance(amb.id)}>
                  Book Ambulance
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithAmbulances;
