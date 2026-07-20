import { MapPin } from "lucide-react";
import { useTripStore } from "@/shared/hooks/useTripStore";

const POPULAR_STATIONS = [
  "Tokyo Station",
  "Shinjuku Station",
  "Shibuya Station",
  "Shinagawa Station",
  "Ueno Station",
  "Yokohama Station",
  "Kyoto Station",
  "Shin-Osaka Station",
  "Osaka Station",
  "Nagoya Station",
  "Fukuoka (Hakata) Station",
  "Sapporo Station",
  "Sendai Station",
  "Kobe (Sannomiya) Station",
  "Hiroshima Station",
  "Kanazawa Station",
  "Naha Airport"
];

export default function StationInput() {
  const { homeStation, setHomeStation } = useTripStore();
  
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
        {POPULAR_STATIONS.map(station => (
          <option key={station} value={station} />
        ))}
      </datalist>
    </div>
  );
}
