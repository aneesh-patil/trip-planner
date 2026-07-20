import { MapPin } from "lucide-react";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { useState, useEffect, useMemo } from "react";

export default function StationInput() {
  const { homeStation, setHomeStation } = useTripStore();
  const [stations, setStations] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/stations.json")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations", err));
  }, []);

  // Show up to 100 matching stations for performance
  const filteredStations = useMemo(() => {
    if (!homeStation) return stations.slice(0, 100);
    const lower = homeStation.toLowerCase();
    const matches = [];
    for (let i = 0; i < stations.length; i++) {
      if (stations[i].toLowerCase().includes(lower)) {
        matches.push(stations[i]);
        if (matches.length >= 100) break;
      }
    }
    // Always include the current value so datalist behaves correctly
    if (!matches.includes(homeStation) && stations.includes(homeStation)) {
      matches.push(homeStation);
    }
    return matches;
  }, [stations, homeStation]);
  
  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
      <MapPin className="w-4 h-4 text-emerald-500" />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0">Base Station:</span>
      <input 
        type="text" 
        list="stations-list"
        value={homeStation} 
        onChange={(e) => setHomeStation(e.target.value)}
        className="bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-slate-200 px-1 py-0.5 min-w-[150px] w-full" 
        placeholder="e.g. Tokyo Station"
      />
      <datalist id="stations-list">
        {filteredStations.map(station => (
          <option key={station} value={station} />
        ))}
      </datalist>
    </div>
  );
}
