import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getDistance } from 'geolib';
import 'leaflet/dist/leaflet.css';

const ambulanceIcon = new L.Icon({
  iconUrl: '../images/ambulanceMarker.png', // make sure this path is correct
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const generateNearbyAmbulances = (lat, lng, count = 5) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Ambulance ${i + 1}`,
    position: [
      lat + (Math.random() - 0.5) * 0.005, // ~500m range
      lng + (Math.random() - 0.5) * 0.005,
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
        console.error('Error fetching location:', error);
      }
    );
  }, []);

  return (
    <MapContainer
      center={userLocation || [19.295, 72.854]} // default center
      zoom={15}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {userLocation && (
        <>
          <SetViewToUser coords={userLocation} />
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}
      {ambulances.map((amb) => (
        <Marker key={amb.id} position={amb.position} icon={ambulanceIcon}>
          <Popup>{amb.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithAmbulances;
