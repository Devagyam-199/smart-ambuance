import React, { useEffect, useState, useRef } from "react";
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

// Generate fake ambulances
const generateNearbyAmbulances = (lat, lng, count = 7) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: "Available Ambulance",
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

const MapWithAmbulances = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [bookedAmbulanceId, setBookedAmbulanceId] = useState(null);
  const [ambulancePosition, setAmbulancePosition] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [eta, setEta] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);

  const intervalRef = useRef(null);

  const handleBookAmbulance = async (amb) => {
    setBookedAmbulanceId(amb.id);
    setAmbulancePosition(amb.position);

    try {
      const res = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624811f93877a93d448b9a0ab9a7c5e38f59&start=${amb.position[1]},${amb.position[0]}&end=${userLocation[1]},${userLocation[0]}`
      );
      const coords = res.data.features[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);
      const duration = res.data.features[0].properties.segments[0].duration; // seconds
      setRouteCoords(coords);
      setEta(duration);

      // Start animation
      let step = 0;
      intervalRef.current = setInterval(() => {
        step += 1;
        if (step >= coords.length) {
          clearInterval(intervalRef.current);
          setAmbulancePosition(userLocation);
          setEta(0);
          setHasArrived(true);
          alert("🚨 Ambulance has arrived!");
          return;
        }
        setAmbulancePosition(coords[step]);

        // Update ETA based on remaining points
        const remainingSteps = coords.length - step;
        const avgTimePerStep = duration / coords.length;
        const newEta = remainingSteps * avgTimePerStep;
        setEta(newEta);
      }, 1000); // 1 second per step
    } catch (error) {
      console.error("Routing failed:", error);
    }
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
      () => {
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
    return () => clearInterval(intervalRef.current);
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
      {ambulances.map((amb) => {
        const isBooked = amb.id === bookedAmbulanceId;
        const ambPos =
          isBooked && ambulancePosition ? ambulancePosition : amb.position;
        return (
          <Marker key={amb.id} position={ambPos} icon={ambulanceIcon}>
            <Popup>
              <div>
                <strong>{amb.name}</strong>
                <br />
                {isBooked ? (
                  hasArrived ? (
                    <span style={{ color: "green" }}>
                      ✅ Booked for you (Arrived)
                    </span>
                  ) : (
                    <>
                      🚑 On the way
                      <br />
                      ETA: {eta ? `${Math.ceil(eta)} sec` : "Calculating..."}
                    </>
                  )
                ) : (
                  <button onClick={() => handleBookAmbulance(amb)}>
                    Book Ambulance
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapWithAmbulances;
