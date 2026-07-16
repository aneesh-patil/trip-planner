import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Destination } from "@/types/destination";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DestinationMapProps {
  destinations: Destination[];
}

export default function DestinationMap({ destinations }: DestinationMapProps) {
  // Center roughly on Yokohama/Tokyo
  const center: [number, number] = [35.5, 139.6];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm z-0">
      <MapContainer center={center} zoom={8} scrollWheelZoom={false} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destinations.map((dest) => (
          <Marker key={dest.id} position={[dest.lat, dest.lng]}>
            <Popup>
              <div className="font-sans">
                <img src={dest.heroImage} alt={dest.name} className="w-full h-24 object-cover rounded-md mb-2" />
                <h3 className="font-bold text-base mb-1">{dest.name}</h3>
                <p className="text-sm text-slate-500 mb-2">{dest.prefecture}</p>
                <Link to={`/destinations/${dest.id}`} className="text-emerald-600 font-medium text-sm hover:underline">
                  View Details &rarr;
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
