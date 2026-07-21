"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ListingMapProps {
  lat: number;
  lng: number;
  cityName: string;
}

export default function ListingMap({ lat, lng, cityName }: ListingMapProps) {
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

  if (!lat || !lng) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">موقعیت روی نقشه</h2>

      <div className="h-75 w-full rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "0.75rem",
          }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <Marker position={[lat, lng]} icon={markerIcon}>
            <Popup>موقعیت آگهی در {cityName}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-400">موقعیت دقیق تا حدودی تقریبی است.</p>
    </div>
  );
}
