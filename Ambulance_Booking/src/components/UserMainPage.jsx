import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import ambulanceMarkerImg from "../images/ambulanceMarker.png";
import userMarkerImg from "../images/finalfinal.png";

// Icons
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

// Fake nearby ambulances
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
    if (coords) {
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
  const bookedAmbulanceRef = useRef(null);

  const ORS_API_KEY = "5b3ce3597851110001cf624811f93877a93d448b9a0ab9a7c5e38f59"; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        const generated = generateNearbyAmbulances(lat, lng);
        setAmbulances(generated);
      },
      (error) => {
        console.error("Location error:", error);
        const fallbackLat = 19.295;
        const fallbackLng = 72.854;
        setUserLocation([fallbackLat, fallbackLng]);
        const generated = generateNearbyAmbulances(fallbackLat, fallbackLng);
        setAmbulances(generated);
      }
    );
  }, []);

  const handleBookAmbulance = async (id) => {
    const ambulance = ambulances.find((a) => a.id === id);
    if (!ambulance || !userLocation) return;

    setBookedAmbulanceId(id);
    bookedAmbulanceRef.current = id;

    // Get route from OpenRouteService
    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    const body = {
      coordinates: [
        [ambulance.position[1], ambulance.position[0]],
        [userLocation[1], userLocation[0]],
      ],
    };

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      });

      const coords = res.data.features[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);

      const durationSec = res.data.features[0].properties.summary.duration;
      setEta(Math.round(durationSec / 60));

      setRouteCoords(coords);
      animateAmbulanceAlongRoute(coords);
    } catch (err) {
      console.error("Routing error:", err);
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
          amb.id === bookedAmbulanceRef.current
            ? { ...amb, position: coords[i] }
            : amb
        )
      );
      i++;
    }, 300); // ← slow realistic speed
  };

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
      ))}

      {/* Route polyline */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" weight={5} />
      )}
    </MapContainer>
  );
};

export default MapWithAmbulances;
