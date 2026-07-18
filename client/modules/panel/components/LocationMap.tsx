"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, MapPin } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface LocationMapProps {
  position: { lat: number; lng: number } | null;
  setPosition: (pos: { lat: number; lng: number }) => void;
  cityCenter: { lat: number; lng: number } | null;
  cityName?: string;
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

function PositionController({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
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

export default function LocationMap({
  position,
  setPosition,
  cityCenter,
  cityName,
}: LocationMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const fullQuery = cityName ? `${query}, ${cityName}, ایران` : `${query}, ایران`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&accept-language=fa&limit=20`,
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  // وقتی کاربر روی یک نتیجه کلیک کرد
  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition({ lat, lng });
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="relative h-100 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 z-0">
      <MapContainer
        center={cityCenter ? [cityCenter.lat, cityCenter.lng] : [32.4279, 53.688]}
        zoom={cityCenter ? 13 : 5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", cursor: "crosshair" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        <MapClickHandler setPosition={setPosition} />
        <CityController center={cityCenter} />
        <PositionController position={position} />
        {position && <Marker position={[position.lat, position.lng]} />}
      </MapContainer>

      <div className="absolute top-3 right-3 left-3 z-1000">
        <div className="relative">
          <input
            type="text"
            placeholder={cityName ? `جستجوی محله در ${cityName}...` : "ابتدا شهر را انتخاب کنید..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={!cityName}
            className="w-full h-11 pr-10 pl-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
          />
          <div className="absolute top-3 right-3 text-zinc-400">
            {isSearching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          {/* لیست نتایج جستجو */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 right-0 left-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-1001">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectResult(res)}
                  className="p-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 text-violet-600 mt-1 shrink-0" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-200">
                    {res.display_name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
