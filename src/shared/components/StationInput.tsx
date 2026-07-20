import { MapPin } from "lucide-react";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { useState, useEffect, useMemo } from "react";

const PREFECTURES = [
  "Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
  "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa",
  "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu",
  "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara",
  "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
  "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki",
  "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"
];

export default function StationInput() {
  const { homeStation, setHomeStation, setHomeStationCoords } = useTripStore();
  
  type StationData = { name: string; lat: number; lng: number };
  // Data for stations by prefecture
  const [stationsByPref, setStationsByPref] = useState<Record<string, StationData[]>>({});
  
  // UI State
  const [isEditing, setIsEditing] = useState<boolean>(!homeStation);
  const [mode, setMode] = useState<"station" | "zip">("station");
  const [selectedPref, setSelectedPref] = useState<string>("Tokyo");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");

  useEffect(() => {
    fetch("/data/stations-by-prefecture.json")
      .then((res) => res.json())
      .then((data) => setStationsByPref(data))
      .catch((err) => console.error("Failed to load stations", err));
  }, []);

  // Parse homeStation on mount or when it changes externally
  useEffect(() => {
    if (!homeStation) return;
    
    // Check if it's a zip code (matches roughly 3-4 digits or 7 digits)
    if (/^\d{3}-?\d{4}$/.test(homeStation) || /^\d+$/.test(homeStation)) {
      setMode("zip");
      setZipCode(homeStation);
    } else if (homeStation.includes(", ")) {
      const parts = homeStation.split(", ");
      setMode("station");
      if (PREFECTURES.includes(parts[1])) {
        setSelectedPref(parts[1]);
      }
      setSelectedStation(parts[0]);
    } else {
      // Fallback
      setMode("station");
      setSelectedStation(homeStation);
    }
  }, [homeStation]);

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStation(e.target.value);
  };

  const handlePrefChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = e.target.value;
    setSelectedPref(p);
    setSelectedStation(""); // reset station
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleSet = () => {
    if (mode === "station" && selectedStation) {
      setHomeStation(`${selectedStation}, ${selectedPref}`);
      const st = stations.find(s => s.name === selectedStation);
      if (st) {
        setHomeStationCoords({ lat: st.lat, lng: st.lng });
      }
    } else if (mode === "zip" && zipCode) {
      setHomeStation(zipCode);
      setHomeStationCoords(null);
    }
    setIsEditing(false);
  };

  const stations = useMemo(() => {
    return stationsByPref[selectedPref] || [];
  }, [stationsByPref, selectedPref]);

  if (!isEditing && homeStation) {
    return (
      <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl w-fit border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-sm">
        <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 shrink-0">
          Base Location: <span className="text-emerald-600 dark:text-emerald-400 ml-1">{homeStation}</span>
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs px-3 py-1 rounded-md transition-colors shadow-sm ml-2"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl w-fit border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 shrink-0">Set Base Location:</span>
        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700">
          <button 
            onClick={() => setMode('station')} 
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${mode === 'station' ? 'bg-white dark:bg-slate-950 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Station
          </button>
          <button 
            onClick={() => setMode('zip')} 
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${mode === 'zip' ? 'bg-white dark:bg-slate-950 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Zip Code
          </button>
        </div>
      </div>
      
      {mode === 'station' ? (
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
           <select 
             value={selectedPref} 
             onChange={handlePrefChange}
             className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-emerald-500 w-full sm:w-32"
           >
             {PREFECTURES.map(p => (
               <option key={p} value={p}>{p}</option>
             ))}
           </select>
           
           <select 
             value={selectedStation} 
             onChange={handleStationChange}
             className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-emerald-500 w-full sm:w-56"
             disabled={stations.length === 0}
           >
             <option value="">-- Select Station --</option>
             {stations.map(st => (
               <option key={st.name} value={st.name}>{st.name}</option>
             ))}
           </select>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="e.g. 100-0001" 
            value={zipCode} 
            onChange={handleZipChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSet()}
            className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-emerald-500 w-full sm:w-64"
          />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSet}
          disabled={(mode === "station" && !selectedStation) || (mode === "zip" && !zipCode)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm px-4 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
        >
          Set
        </button>
        {homeStation && (
          <button
            onClick={() => setIsEditing(false)}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm px-4 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
