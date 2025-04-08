import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

import ambulanceMarkerImg from "../images/ambulanceMarker.png";
import userMarkerImg from "../images/finalfinal.png";

// Custom icon for ambulances
const ambulanceIcon = new L.Icon({
  iconUrl: ambulanceMarkerImg,
  iconSize: [60, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Custom icon for the user
const userIcon = new L.Icon({
  iconUrl: userMarkerImg,
  iconSize: [50, 50],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Generate fake ambulances
const generateNearbyAmbulances = (lat, lng, count = 7) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Available Ambulance ${i + 1}`,
    position: [
      lat + (Math.random() - 0.5) * 0.01,
      lng + (Math.random() - 0.5) * 0.01,
    ],
  }));

const SetViewToUser = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 16);
    }
  }, [coords, map]);
  return null;
};

// Get route from OpenRouteService
const getRoute = async (start, end) => {
  const res = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      coordinates: [start.slice().reverse(), end.slice().reverse()],
    },
    {
      headers: {
        Authorization: "YOUR_OPENROUTESERVICE_API_KEY",
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
};

const MapWithAmbulances = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [bookedAmbulanceId, setBookedAmbulanceId] = useState(null);
  const [eta, setEta] = useState(null);
  const [routePath, setRoutePath] = useState([]);

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

  const handleBookAmbulance = async (id, from, to) => {
    try {
      const coords = await getRoute(from, to);
      setRoutePath(coords);

      // Calculate distance in meters
      const map = L.map("map-id", { zoomControl: false });
      const distance = coords.reduce((acc, curr, i, arr) => {
        if (i === 0) return acc;
        const prev = arr[i - 1];
        const d = map.distance(prev, curr);
        return acc + d;
      }, 0);
      map.remove();

      const averageSpeedKmph = 40; // realistic speed in Indian cities
      const etaMinutes = Math.round((distance / 1000 / averageSpeedKmph) * 60);
      setEta(etaMinutes);
      setBookedAmbulanceId(id);

      animateAmbulanceAlongRoute(coords);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const animateAmbulanceAlongRoute = (coords) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= coords.length) {
        clearInterval(interval);
        return;
      }
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === bookedAmbulanceId
            ? { ...amb, position: coords[i] }
            : amb
        )
      );
      i++;
    }, 400); // slower for realism
  };

  return (
    <MapContainer
      center={userLocation || [19.295, 72.854]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
      id="map-id"
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

      {/* Route line */}
      {routePath.length > 0 && (
        <Polyline positions={routePath} color="blue" weight={5} />
      )}

      {ambulances.map((amb) => (
        <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
          <Popup>
            <div>
              <strong>{amb.name}</strong>
              <br />
              {bookedAmbulanceId === amb.id ? (
                <>
                  <span style={{ color: "green" }}>✅ Booked</span>
                  <br />
                  ETA: {eta} mins
                </>
              ) : (
                <button
                  onClick={() =>
                    handleBookAmbulance(amb.id, amb.position, userLocation)
                  }
                >
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
