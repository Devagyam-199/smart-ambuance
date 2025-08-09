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

const generateNearbyAmbulances = (lat, lng, count = 7) =>
  Array.from({ length: count }).map((_, i) => {
    const radiusInDegrees = 1.5 / 111;
    const randLat = lat + (Math.random() - 0.5) * radiusInDegrees;
    const randLng = lng + (Math.random() - 0.5) * radiusInDegrees;
    return {
      id: i + 1,
      name: `Available Ambulance`,
      position: [randLat, randLng],
    };
  });

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
  const [ambulancePos, setAmbulancePos] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [eta, setEta] = useState(null);
  const [arrivalAlertShown, setArrivalAlertShown] = useState(false);
  const animationRef = useRef(null);
  const speed = 999; // ms between each move – slower speed = more realistic

  const API_KEY = import.meta.env.VITE_ROUTES_API_KEY;

  const fetchRouteAndAnimate = async (ambulance, userLoc) => {
    const [startLat, startLng] = ambulance.position;
    const [endLat, endLng] = userLoc;

    try {
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          coordinates: [
            [startLng, startLat],
            [endLng, endLat],
          ],
        },
        {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const coords = response.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      const duration = response.data.features[0].properties.summary.duration;
      const minutes = Math.ceil(duration / 60);
      setEta(`${minutes} min`);

      setRouteCoords(coords);
      setAmbulancePos(coords[0]);
      animateAmbulance(coords);
    } catch (err) {
      console.error("Routing error:", err);
    }
  };

  const animateAmbulance = (coords) => {
    let index = 0;
    clearInterval(animationRef.current);
    animationRef.current = setInterval(() => {
      if (index < coords.length) {
        setAmbulancePos(coords[index]);
        index++;
      } else {
        clearInterval(animationRef.current);
        setAmbulancePos(coords[coords.length - 1]);
      }
    }, speed);
  };

  const handleBookAmbulance = (id) => {
    setBookedAmbulanceId(id);
    const selectedAmbulance = ambulances.find((a) => a.id === id);
    fetchRouteAndAnimate(selectedAmbulance, userLocation);
  };

  useEffect(() => {
    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          setAmbulances(generateNearbyAmbulances(lat, lng));
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please enable GPS/location services and allow location access in your browser."
          );
        },
        {
          enableHighAccuracy: true, // Forces GPS instead of rough IP location
          timeout: 10000, // Max wait time for location fix
          maximumAge: 0, // Always get fresh location
        }
      );
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (
      ambulancePos &&
      userLocation &&
      !arrivalAlertShown &&
      bookedAmbulanceId
    ) {
      const dist = L.latLng(ambulancePos).distanceTo(userLocation);
      if (dist < 30) {
        alert("🚑 Ambulance has arrived!");
        setArrivalAlertShown(true);
      }
    }
  }, [ambulancePos, userLocation, arrivalAlertShown, bookedAmbulanceId]);

  return (
    <div className="relative h-screen w-full">
      {bookedAmbulanceId && (
        <div className="absolute z-[999] top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg px-5 py-2 rounded-full flex gap-3 items-center">
          <span className="text-green-600 font-semibold text-sm">
            ✅ Booked for you
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            ETA: {eta || "Calculating..."}
          </span>
        </div>
      )}

      <MapContainer
        center={userLocation || [19.295, 72.854]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
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
          amb.id === bookedAmbulanceId ? null : (
            <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
              <Popup>
                <div className="flex flex-col items-start gap-2">
                  <strong className="text-base text-gray-800">
                    {amb.name}
                  </strong>
                  <button
                    onClick={() => handleBookAmbulance(amb.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded shadow transition-all duration-200"
                  >
                    Book Ambulance
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        )}

        {bookedAmbulanceId && ambulancePos && (
          <Marker position={ambulancePos} icon={ambulanceIcon}>
            <Popup>
              <span className="text-green-600 font-semibold">
                Ambulance is near!
              </span>
            </Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "blue", weight: 5 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithAmbulances;
