import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import { Search, Clock, Train, Car, Bus, TrainFront, Star, Heart, CloudRain, Sparkles, Footprints, Coins, ThermometerSun } from "lucide-react";

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
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Name, region, tags..."
              className="pl-12 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 rounded-xl text-base font-medium"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Sort By</label>
          <Select value={sortBy} onValueChange={(val: string | null) => { if (val) setSortBy(val); }}>
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
              {sortBy === "overall" && <div className="flex items-center"><Star className="w-5 h-5 mr-3 text-amber-500" /> Highest Rated</div>}
              {sortBy === "travelTime" && <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-blue-500" /> Fastest Travel</div>}
              {sortBy === "budget" && <div className="flex items-center"><Coins className="w-5 h-5 mr-3 text-emerald-500" /> Lowest Budget</div>}
              {sortBy === "walking" && <div className="flex items-center"><Footprints className="w-5 h-5 mr-3 text-slate-500" /> Least Walking</div>}
              {sortBy === "couple" && <div className="flex items-center"><Heart className="w-5 h-5 mr-3 text-rose-500" /> Best for Couples</div>}
              {sortBy === "summer" && <div className="flex items-center"><ThermometerSun className="w-5 h-5 mr-3 text-orange-500" /> Best for Summer</div>}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
              <SelectItem value="overall" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Star className="w-4 h-4 mr-3 text-amber-500" /> <span className="font-medium">Highest Rated</span></div>
              </SelectItem>
              <SelectItem value="travelTime" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-blue-500" /> <span className="font-medium">Fastest Travel</span></div>
              </SelectItem>
              <SelectItem value="budget" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Coins className="w-4 h-4 mr-3 text-emerald-500" /> <span className="font-medium">Lowest Budget</span></div>
              </SelectItem>
              <SelectItem value="walking" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Footprints className="w-4 h-4 mr-3 text-slate-500" /> <span className="font-medium">Least Walking</span></div>
              </SelectItem>
              <SelectItem value="couple" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Heart className="w-4 h-4 mr-3 text-rose-500" /> <span className="font-medium">Best for Couples</span></div>
              </SelectItem>
              <SelectItem value="summer" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><ThermometerSun className="w-4 h-4 mr-3 text-orange-500" /> <span className="font-medium">Best for Summer</span></div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transport */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Transport</label>
          <Select value={transportMode} onValueChange={(val: string | null) => { if (val) setTransportMode(val); }}>
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
              {transportMode === "all" && <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-slate-400" /> Any Transport</div>}
              {transportMode === "train" && <div className="flex items-center"><Train className="w-5 h-5 mr-3 text-blue-500" /> Train Accessible</div>}
              {transportMode === "car" && <div className="flex items-center"><Car className="w-5 h-5 mr-3 text-emerald-500" /> Car Recommended</div>}
              {transportMode === "shinkansen" && <div className="flex items-center"><TrainFront className="w-5 h-5 mr-3 text-purple-500" /> Shinkansen</div>}
              {transportMode === "bus" && <div className="flex items-center"><Bus className="w-5 h-5 mr-3 text-amber-600" /> Highway Bus</div>}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
              <SelectItem value="all" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Sparkles className="w-4 h-4 mr-3 text-slate-400" /> <span className="font-medium">Any Transport</span></div>
              </SelectItem>
              <SelectItem value="train" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Train className="w-4 h-4 mr-3 text-blue-500" /> <span className="font-medium">Train</span></div>
              </SelectItem>
              <SelectItem value="car" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Car className="w-4 h-4 mr-3 text-emerald-500" /> <span className="font-medium">Car</span></div>
              </SelectItem>
              <SelectItem value="shinkansen" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><TrainFront className="w-4 h-4 mr-3 text-purple-500" /> <span className="font-medium">Shinkansen</span></div>
              </SelectItem>
              <SelectItem value="bus" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Bus className="w-4 h-4 mr-3 text-amber-600" /> <span className="font-medium">Highway Bus</span></div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weather */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">Weather/Season</label>
          <Select value={weather} onValueChange={(val: string | null) => { if (val) setWeather(val); }}>
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
              {weather === "all" && <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-slate-400" /> Any Weather</div>}
              {weather === "indoor" && <div className="flex items-center"><CloudRain className="w-5 h-5 mr-3 text-blue-400" /> Rainy Day (Indoor)</div>}
              {weather === "summer" && <div className="flex items-center"><ThermometerSun className="w-5 h-5 mr-3 text-orange-500" /> Beat the Heat</div>}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
              <SelectItem value="all" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><Sparkles className="w-4 h-4 mr-3 text-slate-400" /> <span className="font-medium">Any Weather</span></div>
              </SelectItem>
              <SelectItem value="indoor" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><CloudRain className="w-4 h-4 mr-3 text-blue-400" /> <span className="font-medium">Rainy Day (Indoor)</span></div>
              </SelectItem>
              <SelectItem value="summer" className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                <div className="flex items-center"><ThermometerSun className="w-4 h-4 mr-3 text-orange-500" /> <span className="font-medium">Beat the Heat</span></div>
              </SelectItem>
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
