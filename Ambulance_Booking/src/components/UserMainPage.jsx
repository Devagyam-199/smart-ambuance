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

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl: ambulanceMarkerImg,
  iconSize: [60, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// User icon
const userIcon = new L.Icon({
  iconUrl: userMarkerImg,
  iconSize: [50, 50],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Generate fake nearby ambulances
const generateNearbyAmbulances = (lat, lng, count = 5) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Available`,
    position: [
      lat + (Math.random() - 0.5) * 0.01,
      lng + (Math.random() - 0.5) * 0.01,
    ],
  }));

// Move map to user location
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
  const [bookedAmbulance, setBookedAmbulance] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const ambulanceMarkerRef = useRef(null);

  const API_KEY = "5b3ce3597851110001cf624811f93877a93d448b9a0ab9a7c5e38f59"; // 🔑 Replace with your API key

  // Fetch route from OpenRouteService
  const fetchRoute = async (from, to) => {
    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    try {
      const res = await axios.post(
        url,
        {
          coordinates: [
            [from[1], from[0]],
            [to[1], to[0]],
          ],
        },
        {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const coordinates = res.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      setRouteCoords(coordinates);
      animateAmbulance(coordinates);
    } catch (error) {
      console.error("Failed to fetch route:", error);
    }
  };

  // Animate ambulance marker along route
  const animateAmbulance = (coordinates, index = 0) => {
    if (!ambulanceMarkerRef.current || index >= coordinates.length) return;

    ambulanceMarkerRef.current.setLatLng(coordinates[index]);
    setTimeout(() => animateAmbulance(coordinates, index + 1), 500);
  };

  // Handle booking
  const handleBookAmbulance = (amb) => {
    setBookedAmbulance(amb);
    fetchRoute(amb.position, userLocation);
    alert(`🚑 Ambulance ${amb.id} is on its way!`);
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
        const fallbackLat = 19.295;
        const fallbackLng = 72.854;
        setUserLocation([fallbackLat, fallbackLng]);
        setAmbulances(generateNearbyAmbulances(fallbackLat, fallbackLng));
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

      {ambulances.map((amb) =>
        bookedAmbulance?.id === amb.id ? (
          <Marker
            key={amb.id}
            icon={ambulanceIcon}
            position={routeCoords[0] || amb.position}
            ref={ambulanceMarkerRef}
          >
            <Popup>🚑 En route to you!</Popup>
          </Marker>
        ) : (
          <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
            <Popup>
              <div>
                <strong>{amb.name}</strong>
                <br />
                <button onClick={() => handleBookAmbulance(amb)}>
                  Book Ambulance
                </button>
              </div>
            </Popup>
          </Marker>
        )
      )}

      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords}
          color="red"
          weight={4}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
};

export default MapWithAmbulances;
