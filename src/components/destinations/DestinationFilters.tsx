import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

interface DestinationFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  maxBudget: number;
  setMaxBudget: (val: number) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  transportMode: string;
  setTransportMode: (val: string) => void;
  weather: string;
  setWeather: (val: string) => void;
  maxWalking: number;
  setMaxWalking: (val: number) => void;
  onReset: () => void;
}

export default function DestinationFilters({
  searchQuery,
  setSearchQuery,
  maxBudget,
  setMaxBudget,
  sortBy,
  setSortBy,
  transportMode,
  setTransportMode,
  weather,
  setWeather,
  maxWalking,
  setMaxWalking,
  onReset
}: DestinationFiltersProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
            <Search className="w-4 h-4 mr-1.5 text-emerald-500" /> Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Name, region, tags..."
              className="pl-9 h-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Sort By</label>
          <Select value={sortBy} onValueChange={(val) => { if (val) setSortBy(val as string); }}>
            <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-emerald-500">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Highest Rated</SelectItem>
              <SelectItem value="travelTime">Fastest Travel</SelectItem>
              <SelectItem value="budget">Lowest Budget</SelectItem>
              <SelectItem value="walking">Least Walking</SelectItem>
              <SelectItem value="couple">Best for Couples</SelectItem>
              <SelectItem value="summer">Best for Summer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transport */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Transport</label>
          <Select value={transportMode} onValueChange={(val) => { if (val) setTransportMode(val as string); }}>
            <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-emerald-500">
              <SelectValue placeholder="Any Transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Transport</SelectItem>
              <SelectItem value="train">Train Accessible</SelectItem>
              <SelectItem value="car">Car Recommended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weather */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Weather/Season</label>
          <Select value={weather} onValueChange={(val) => { if (val) setWeather(val as string); }}>
            <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-emerald-500">
              <SelectValue placeholder="Any Weather" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Weather</SelectItem>
              <SelectItem value="indoor">Rainy Day (Indoor)</SelectItem>
              <SelectItem value="summer">Beat the Heat (Summer)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Budget Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Max Budget (per couple)</label>
              <span className="text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md">
                ¥{maxBudget.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[maxBudget]}
              max={100000}
              step={5000}
              onValueChange={(val: number | readonly number[]) => setMaxBudget(Array.isArray(val) ? val[0] : val)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>¥0</span>
              <span>¥100,000+</span>
            </div>
          </div>

          {/* Walking Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Max Walking (Steps)</label>
              <span className="text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md">
                {maxWalking >= 25000 ? "Any amount" : `${(maxWalking / 1000).toFixed(1)}k steps`}
              </span>
            </div>
            <Slider
              value={[maxWalking]}
              min={2000}
              max={25000}
              step={1000}
              onValueChange={(val: number | readonly number[]) => setMaxWalking(Array.isArray(val) ? val[0] : val)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>2k steps</span>
              <span>25k+ steps</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="w-full lg:w-auto flex justify-end">
          <button
            onClick={onReset}
            className="px-6 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-lg transition-colors whitespace-nowrap"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
