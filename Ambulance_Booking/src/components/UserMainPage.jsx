// MapWithAmbulances.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import ambulanceMarkerImg from "../images/ambulanceMarker.png";
import userMarkerImg from "../images/finalfinal.png";

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

const generateNearbyAmbulances = (lat, lng, count = 1) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Available Ambulance`,
    position: [lat + (Math.random() - 0.5) * 0.01, lng + (Math.random() - 0.5) * 0.01],
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
  const [route, setRoute] = useState([]);
  const [ambulancePosition, setAmbulancePosition] = useState(null);
  const [eta, setEta] = useState(null);
  const intervalRef = useRef(null);

  const ORS_API_KEY = "5b3ce3597851110001cf624811f93877a93d448b9a0ab9a7c5e38f59";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        const generatedAmbulances = generateNearbyAmbulances(lat, lng, 1);
        setAmbulances(generatedAmbulances);
      },
      () => {
        const fallbackLat = 19.295;
        const fallbackLng = 72.854;
        setUserLocation([fallbackLat, fallbackLng]);
        const generatedAmbulances = generateNearbyAmbulances(fallbackLat, fallbackLng, 1);
        setAmbulances(generatedAmbulances);
      }
    );
  }, []);

  const getRoute = async (start, end) => {
    const res = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [start, end],
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  };

  const handleBookAmbulance = async (amb) => {
    setBookedAmbulanceId(amb.id);
    const routeCoords = await getRoute([amb.position[1], amb.position[0]], [userLocation[1], userLocation[0]]);
    setRoute(routeCoords);
    setAmbulancePosition(routeCoords[0]);

    let index = 0;
    intervalRef.current = setInterval(() => {
      index++;
      if (index >= routeCoords.length) {
        clearInterval(intervalRef.current);
        setEta("Arrived");
        return;
      }

      const currentPos = routeCoords[index];
      setAmbulancePosition(currentPos);

      // Basic ETA estimate assuming 30 km/h = 8.33 m/s
      const remainingDistance = routeCoords.length - index;
      const estimatedSeconds = remainingDistance * 0.8;
      const minutes = Math.floor(estimatedSeconds / 60);
      const seconds = Math.floor(estimatedSeconds % 60);
      setEta(`${minutes} min ${seconds} sec`);
    }, 500); // Move every 0.5 seconds to slow down the speed
  };

  return (
    <MapContainer center={userLocation || [19.295, 72.854]} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <SetViewToUser coords={userLocation} />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              You are here <br />
              {eta && <div><strong>ETA: {eta}</strong></div>}
            </Popup>
          </Marker>
        </>
      )}

      {ambulances.map((amb) => {
        const pos = bookedAmbulanceId === amb.id && ambulancePosition ? ambulancePosition : amb.position;
        return (
          <Marker key={amb.id} position={pos} icon={ambulanceIcon}>
            <Popup>
              <div>
                <strong>{amb.name}</strong>
                <br />
                {bookedAmbulanceId === amb.id ? (
                  eta === "Arrived" ? (
                    <span style={{ color: "green" }}>✅ Booked for you</span>
                  ) : (
                    <span style={{ color: "orange" }}>🚑 On the way<br />ETA: {eta}</span>
                  )
                ) : (
                  <button onClick={() => handleBookAmbulance(amb)}>Book Ambulance</button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {route.length > 0 && <Polyline positions={route} color="blue" weight={4} />}
    </MapContainer>
  );
};

export default MapWithAmbulances;
