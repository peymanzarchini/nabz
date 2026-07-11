"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface ListingMapProps {
  lat: number;
  lng: number;
  cityName: string;
}

const ListingMap = ({ lat, lng, cityName }: ListingMapProps) => {
  if (!lat || !lng) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">موقعیت روی نقشه</h2>
      <div className="h-75 w-full rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 z-0">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <Marker position={[lat, lng]}>
            <Popup>موقعیت آگهی در {cityName}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <p className="text-xs text-zinc-400 mt-3 text-center">موقعیت دقیق تا حدودی تقریبی است.</p>
    </div>
  );
};

export default ListingMap;
