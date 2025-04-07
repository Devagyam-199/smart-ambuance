import { Marker, Popup } from "react-leaflet";
import { ambulances } from "../components/ambulanceLocation";
import L from "leaflet";
import ambulanceIconImg from "../images/ambulanceMarker.png";

const ambulanceIcon = new L.Icon({
  iconUrl: ambulanceIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const AmbulanceMarkers = () => {
  return (
    <>
      {ambulances.map((ambulance) => (
        <Marker
          key={ambulance.id}
          position={ambulance.position}
          icon={ambulanceIcon}
        >
          <Popup>
            <strong>{ambulance.name}</strong>
            <br />
            Status: Available
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default AmbulanceMarkers;
