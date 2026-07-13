"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationMapProps {
  position: { lat: number; lng: number } | null;
  setPosition: (pos: { lat: number; lng: number }) => void;
  cityCenter: { lat: number; lng: number } | null;
}

function MapClickHandler({
  setPosition,
}: {
  setPosition: (pos: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function CityController({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 13, { duration: 1.5 });
    } else {
      map.flyTo([32.4279, 53.688], 5, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

export default function LocationMap({ position, setPosition, cityCenter }: LocationMapProps) {
  const markerIcon = useMemo(
    () =>
      new L.Icon({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    [],
  );

  const initialCenter: [number, number] = cityCenter
    ? [cityCenter.lat, cityCenter.lng]
    : [32.4279, 53.688];

  const initialZoom = cityCenter ? 13 : 5;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", cursor: "crosshair", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapClickHandler setPosition={setPosition} />
        <CityController center={cityCenter} />

        {position && <Marker position={[position.lat, position.lng]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
