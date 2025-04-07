import { useState, useEffect } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  MapContainer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import L from "leaflet";

// Fix leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom component to recenter map when coordinates change
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 16);
    }
  }, [lat, lng, map]);
  return null;
};

const UserMainPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccess, setLocationAccess] = useState(false);

  useEffect(() => {
    if (!locationAccess) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location", error);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [locationAccess]);

  const handleAllowLocation = () => {
    setLocationAccess(true);
  };

  return (
    <div className="h-[90vh] w-full">
      {!locationAccess ? (
        <div className="flex justify-center items-center h-full">
          <button
            onClick={handleAllowLocation}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Allow Location Access
          </button>
        </div>
      ) : userLocation ? (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={16}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your current location </Popup>
          </Marker>
          <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
        </MapContainer>
      ) : (
        <p className="text-center text-gray-600">Getting your location...</p>
      )}
    </div>
  );
};

export default UserMainPage;
