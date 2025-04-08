import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import ambulanceMarkerImg from "../images/ambulanceMarker.png";
import userMarkerImg from "../images/finalfinal.png"; // Optional: change this if you want another icon for user

// Custom icon for ambulances
const ambulanceIcon = new L.Icon({
  iconUrl: ambulanceMarkerImg,
  iconSize: [60, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Optional: Custom icon for the user
const userIcon = new L.Icon({
  iconUrl: userMarkerImg,
  iconSize: [50, 50],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Generate fake ambulance markers around user's location
const generateNearbyAmbulances = (lat, lng, count = 5) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Available`,
    position: [
      lat + (Math.random() - 0.5) * 0.01,
      lng + (Math.random() - 0.5) * 0.01,
    ],
  }));

// Helper to move map to user's location
const SetViewToUser = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 16);
    }
  }, [coords, map]);
  return null;
};

const MapWithAmbulances = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [bookedAmbulanceId, setBookedAmbulanceId] = useState(null);

  const handleBookAmbulance = (id) => {
    setBookedAmbulanceId(id);
    alert(`🚑 Ambulance ${id} has been booked!`);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);

        const generatedAmbulances = generateNearbyAmbulances(lat, lng);
        setAmbulances(generatedAmbulances);
      },
      (error) => {
        console.error("Error fetching location:", error);
        // Fallback location
        const fallbackLat = 19.295;
        const fallbackLng = 72.854;
        setUserLocation([fallbackLat, fallbackLng]);
        const generatedAmbulances = generateNearbyAmbulances(
          fallbackLat,
          fallbackLng
        );
        setAmbulances(generatedAmbulances);
      }
    );
  }, []);

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

      {userLocation && (
        <>
          <SetViewToUser coords={userLocation} />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}

      {ambulances.map((amb) => (
        <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
          <Popup>
            <div>
              <strong>{amb.name}</strong>
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
