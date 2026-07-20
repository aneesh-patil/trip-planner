import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { MapPin } from "lucide-react";
import { destinationService } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const regionColors: Record<string, string> = {
  Kanto: "#059669",
  Chubu: "#2563eb",
  Kansai: "#7c3aed",
  Tohoku: "#d97706",
  Hokkaido: "#0284c7",
  Kyushu: "#ea580c",
  Default: "#64748b",
};

export default function JapanMap() {
  const allDestinations =
    destinationService.getDestinationList() as Destination[];
  const [activeRegion, setActiveRegion] = useState<string>("All");

  const regions = [
    "All",
    ...Array.from(new Set(allDestinations.map((d) => d.region))),
  ];
  const center: [number, number] = [36.0, 138.0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-background">
      {/* Header & Controls */}
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
            Graphical Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Interactive map. Filter regions to explore.
          </p>
        </div>

        {/* Legend / Filters */}
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => {
            const isActive = activeRegion === region;
            const colorObj = regionColors[region] || regionColors.Default;

            return (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                {region !== "All" && (
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colorObj }}
                  />
                )}
                {region}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden relative z-0">
        <MapContainer
          center={center}
          zoom={6}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {allDestinations
            .filter(
              (d) =>
                d.coordinates &&
                (activeRegion === "All" || d.region === activeRegion),
            )
            .map((dest) => {
              const { lat, lng } = dest.coordinates!;
              const colorObj =
                regionColors[dest.region] || regionColors.Default;

              const customIcon = L.divIcon({
                className: "custom-map-marker",
                html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform" style="background-color: ${colorObj}"><img src="${dest.heroImage}" class="w-full h-full rounded-full object-cover opacity-80 mix-blend-screen" /></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16],
              });

              return (
                <Marker key={dest.id} position={[lat, lng]} icon={customIcon}>
                  <Popup className="custom-popup">
                    <div className="font-sans min-w-[200px] p-3">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-28 object-cover rounded-md mb-2"
                      />
                      <h3 className="font-bold text-lg mb-0">{dest.name}</h3>
                      <div className="text-sm font-medium text-emerald-600 mb-2">
                        ★ {dest.ratings?.overall || "N/A"}/10
                      </div>
                      <p className="text-sm text-slate-500 mb-3">
                        {dest.description
                          ? dest.description.slice(0, 60) + "..."
                          : "No description available"}
                      </p>
                      <Link to={`/destinations/${dest.id}`}>
                        <Button
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          View Guide
                        </Button>
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
