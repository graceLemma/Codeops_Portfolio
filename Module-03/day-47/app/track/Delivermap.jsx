// app/track/DeliveryMap.jsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Helper component to auto-fit bounds between courier and destination
function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers && markers.length > 0) {
      map.fitBounds(markers, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

const BOLE_DESTINATION = [8.9950, 38.7896]; // [lat, lng]

export default function DeliveryMap({ courierPosition }) {
  const courier = courierPosition || [8.9980, 38.7850];
  const markers = [courier, BOLE_DESTINATION];

  return (
    <MapContainer center={BOLE_DESTINATION} zoom={14} style={{ height: "320px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={courier}>
        <Popup>Courier is on the way</Popup>
      </Marker>
      <Marker position={BOLE_DESTINATION}>
        <Popup>Almaz · Bole · Target Destination</Popup>
      </Marker>
      <FitBounds markers={markers} />
    </MapContainer>
  );
}