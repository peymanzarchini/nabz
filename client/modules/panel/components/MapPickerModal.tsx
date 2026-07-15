/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (position: { lat: number; lng: number }, address: string) => void;
  cityCenter: { lat: number; lng: number } | null;
  cityName?: string;
  initialPosition: { lat: number; lng: number } | null;
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

export default function MapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  cityCenter,
  cityName,
  initialPosition,
}: MapPickerModalProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initialPosition);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPosition(initialPosition);
      setAddress("");
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, initialPosition]);

  const fetchAddress = async (lat: number, lng: number) => {
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`,
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress("آدرسی برای این مکان یافت نشد.");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setAddress("خطا در دریافت آدرس.");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // وقتی کاربر روی نقشه کلیک می‌کند
  const handleSetPosition = (pos: { lat: number; lng: number }) => {
    setPosition(pos);
    fetchAddress(pos.lat, pos.lng);
  };

  // جستجوی آدرس (دقیقاً مشابه کد شما)
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

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    handleSetPosition({ lat, lng });
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleConfirm = () => {
    if (position) {
      onConfirm(position, address);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-white">انتخاب موقعیت دقیق</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* بدنه مودال */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 overflow-y-auto">
          {/* نقشه (مشابه کد شما) */}
          <div className="relative h-[300px] md:h-full md:min-h-[450px] w-full">
            <MapContainer
              center={
                position
                  ? [position.lat, position.lng]
                  : cityCenter
                    ? [cityCenter.lat, cityCenter.lng]
                    : [32.4279, 53.688]
              }
              zoom={position ? 16 : cityCenter ? 13 : 5}
              scrollWheelZoom
              style={{ height: "100%", width: "100%", cursor: "crosshair" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              />
              <MapClickHandler setPosition={handleSetPosition} />
              <CityController center={cityCenter} />
              <PositionController position={position} />
              {position && <Marker position={[position.lat, position.lng]} />}
            </MapContainer>

            <div className="absolute top-3 right-3 left-3 z-[1000]">
              <div className="relative">
                <input
                  type="text"
                  placeholder={cityName ? `جستجوی محله در ${cityName}...` : "جستجوی محله..."}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="absolute top-3 right-3 text-zinc-400">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute top-12 right-0 left-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[1001]">
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

          {/* فیلد آدرس متنی */}
          <div className="p-6 flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-950">
            <div>
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-2 block">
                آدرس دقیق استخراج شده
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  value={isFetchingAddress ? "در حال دریافت آدرس..." : address}
                  placeholder="برای دریافت آدرس، روی نقشه کلیک کنید یا جستجو کنید."
                  className="w-full h-40 p-3 bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white rounded-md text-sm resize-none outline-none"
                />
                {isFetchingAddress && (
                  <Loader2 className="absolute top-3 left-3 h-4 w-4 animate-spin text-violet-600" />
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                مختصات:{" "}
                {position
                  ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                  : "انتخاب نشده"}
              </p>
            </div>
          </div>
        </div>

        {/* فوتر مودال */}
        <div className="flex justify-end gap-3 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Button variant="ghost" onClick={onClose} className="dark:text-zinc-300">
            انصراف
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!position || isFetchingAddress}
            className="bg-linear-to-r from-violet-600 to-teal-500 text-white cursor-pointer"
          >
            تایید موقعیت
          </Button>
        </div>
      </div>
    </div>
  );
}
