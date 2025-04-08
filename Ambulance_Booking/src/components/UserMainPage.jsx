import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icuAmbulanceImg from "../images/icuAmbulance.png";
import basicAmbulanceImg from "../images/basicAmbulance.png";
import alsAmbulanceImg from "../images/alsAmbulance.png";
import userMarkerImg from "../images/user.png";

const ambulanceTypes = {
  ICU: {
    icon: icuAmbulanceImg,
    cost: 4000,
    speed: 40, // km/h
  },
  Basic: {
    icon: basicAmbulanceImg,
    cost: 1500,
    speed: 50,
  },
  ALS: {
    icon: alsAmbulanceImg,
    cost: 2500,
    speed: 45,
  },
};

const createIcon = (img) =>
  new L.Icon({
    iconUrl: img,
    iconSize: [30, 50],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

const userIcon = createIcon(userMarkerImg);

// Distance calculator (Haversine)
const getDistanceInKm = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
};

const generateNearbyAmbulances = (lat, lng, count = 7) =>
  Array.from({ length: count }).map((_, i) => {
    const types = Object.keys(ambulanceTypes);
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: i + 1,
      name: `${type} Ambulance`,
      type,
      position: [
        lat + (Math.random() - 0.5) * 0.01,
        lng + (Math.random() - 0.5) * 0.01,
      ],
    };
  });

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
  const [filterType, setFilterType] = useState("All");

  const handleBookAmbulance = (id) => {
    setBookedAmbulanceId(id);
    alert(`✅ Ambulance ${id} has been booked!`);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        setAmbulances(generateNearbyAmbulances(lat, lng));
      },
      () => {
        const fallback = [19.295, 72.854];
        setUserLocation(fallback);
        setAmbulances(generateNearbyAmbulances(...fallback));
      }
    );
  }, []);

  const filteredAmbulances =
    filterType === "All"
      ? ambulances
      : ambulances.filter((a) => a.type === filterType);

  return (
    <div>
      <div style={{ position: "absolute", zIndex: 999, padding: 10 }}>
        <label>
          Filter: &nbsp;
          <select onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All</option>
            {Object.keys(ambulanceTypes).map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

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

        {filteredAmbulances.map((amb) => {
          const { type, position } = amb;
          const distance = getDistanceInKm(userLocation, position);
          const arrivalTime = Math.round((distance / ambulanceTypes[type].speed) * 60);
          const icon = createIcon(ambulanceTypes[type].icon);

          return (
            <Marker key={amb.id} position={position} icon={icon}>
              <Popup>
                <strong>{amb.name}</strong>
                <br />
                🚗 Distance: {distance} km
                <br />
                ⏱ ETA: {arrivalTime} mins
                <br />
                💰 Cost: ₹{ambulanceTypes[type].cost}
                <br />
                {bookedAmbulanceId === amb.id ? (
                  <span style={{ color: "green" }}>✅ Booked</span>
                ) : (
                  <button onClick={() => handleBookAmbulance(amb.id)}>
                    Book Now
                  </button>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapWithAmbulances;
