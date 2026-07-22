import { useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import {
  Search,
  Clock,
  Train,
  Bus,
  TrainFront,
  Star,
  Heart,
  CloudRain,
  Sparkles,
  Footprints,
  Coins,
  ThermometerSun,
  Snowflake,
} from "lucide-react";

interface DestinationFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  maxBudget: number;
  setMaxBudget: (val: number) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  carMode: string;
  setCarMode: (val: string) => void;
  publicModes: string[];
  setPublicModes: (val: string[]) => void;
  partySize: number;
  setPartySize: (val: number) => void;
  weather: string;
  setWeather: (val: string) => void;
  maxWalking: number;
  setMaxWalking: (val: number) => void;
  totalMatches?: number;
  onSearch?: () => void;
  onReset: () => void;
}

export default function DestinationFilters({
  searchQuery,
  setSearchQuery,
  maxBudget,
  setMaxBudget,
  sortBy,
  setSortBy,
  carMode,
  setCarMode,
  publicModes,
  setPublicModes,
  partySize,
  setPartySize,
  weather,
  setWeather,
  maxWalking,
  setMaxWalking,
  totalMatches,
  onSearch,
  onReset,
}: DestinationFiltersProps) {
  const { user } = useAuth();
  const carOwnership = user?.user_metadata?.preferences?.carOwnership || "all";
  const showRental = carOwnership === "all" || carOwnership === "rental";
  const showMyCar = carOwnership === "all" || carOwnership === "my_car";

  useEffect(() => {
    if (!showRental && carMode === "rental") {
      setCarMode("none");
    } else if (!showMyCar && carMode === "my_car") {
      setCarMode("none");
    }
  }, [showRental, showMyCar, carMode, setCarMode]);
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
            Sort By
          </label>
          <Select
            value={sortBy}
            onValueChange={(val: string | null) => {
              if (val) setSortBy(val);
            }}
          >
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
              {sortBy === "overall" && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-3 text-amber-500" /> Highest Rated
                </div>
              )}
              {sortBy === "travelTime" && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-500" /> Fastest
                  Travel
                </div>
              )}
              {sortBy === "budget" && (
                <div className="flex items-center">
                  <Coins className="w-5 h-5 mr-3 text-emerald-500" /> Lowest
                  Budget
                </div>
              )}
              {sortBy === "walking" && (
                <div className="flex items-center">
                  <Footprints className="w-5 h-5 mr-3 text-slate-500" /> Least
                  Walking
                </div>
              )}
              {sortBy === "couple" && (
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-3 text-rose-500" /> Best for
                  Couples
                </div>
              )}
              {sortBy === "summer" && (
                <div className="flex items-center">
                  <ThermometerSun className="w-5 h-5 mr-3 text-orange-500" />{" "}
                  Best for Summer
                </div>
              )}
              {sortBy === "winter" && (
                <div className="flex items-center">
                  <Snowflake className="w-5 h-5 mr-3 text-cyan-500" /> Best for
                  Winter
                </div>
              )}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
              <SelectItem
                value="overall"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-3 text-amber-500" />{" "}
                  <span className="font-medium">Highest Rated</span>
                </div>
              </SelectItem>
              <SelectItem
                value="travelTime"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-blue-500" />{" "}
                  <span className="font-medium">Fastest Travel</span>
                </div>
              </SelectItem>
              <SelectItem
                value="budget"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Coins className="w-4 h-4 mr-3 text-emerald-500" />{" "}
                  <span className="font-medium">Lowest Budget</span>
                </div>
              </SelectItem>
              <SelectItem
                value="walking"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Footprints className="w-4 h-4 mr-3 text-slate-500" />{" "}
                  <span className="font-medium">Least Walking</span>
                </div>
              </SelectItem>
              <SelectItem
                value="couple"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-3 text-rose-500" />{" "}
                  <span className="font-medium">Best for Couples</span>
                </div>
              </SelectItem>
              <SelectItem
                value="summer"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <ThermometerSun className="w-4 h-4 mr-3 text-orange-500" />{" "}
                  <span className="font-medium">Best for Summer</span>
                </div>
              </SelectItem>
              <SelectItem
                value="winter"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Snowflake className="w-4 h-4 mr-3 text-cyan-500" />{" "}
                  <span className="font-medium">Best for Winter</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weather */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
            Weather/Season
          </label>
          <Select
            value={weather}
            onValueChange={(val: string | null) => {
              if (val) setWeather(val);
            }}
          >
            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
              {weather === "all" && (
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-3 text-slate-400" /> Any
                  Weather
                </div>
              )}
              {weather === "indoor" && (
                <div className="flex items-center">
                  <CloudRain className="w-5 h-5 mr-3 text-blue-400" /> Rainy Day
                  (Indoor)
                </div>
              )}
              {weather === "summer" && (
                <div className="flex items-center">
                  <ThermometerSun className="w-5 h-5 mr-3 text-orange-500" />{" "}
                  Beat the Heat
                </div>
              )}
              {weather === "winter" && (
                <div className="flex items-center">
                  <Snowflake className="w-5 h-5 mr-3 text-cyan-500" /> Winter
                  Magic
                </div>
              )}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
              <SelectItem
                value="all"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-3 text-slate-400" />{" "}
                  <span className="font-medium">Any Weather</span>
                </div>
              </SelectItem>
              <SelectItem
                value="indoor"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <CloudRain className="w-4 h-4 mr-3 text-blue-400" />{" "}
                  <span className="font-medium">Rainy Day (Indoor)</span>
                </div>
              </SelectItem>
              <SelectItem
                value="summer"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <ThermometerSun className="w-4 h-4 mr-3 text-orange-500" />{" "}
                  <span className="font-medium">Beat the Heat</span>
                </div>
              </SelectItem>
              <SelectItem
                value="winter"
                className="py-2.5 px-3 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center">
                  <Snowflake className="w-4 h-4 mr-3 text-cyan-500" />{" "}
                  <span className="font-medium">Winter Magic</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Party Size Stepper */}
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
            Party Size
          </label>
          <div className="flex items-center justify-between h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors text-slate-600 dark:text-slate-400 font-bold"
            >
              -
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-200 w-16 text-center text-sm">
              {partySize} {partySize === 1 ? "Person" : "People"}
            </span>
            <button
              onClick={() => setPartySize(Math.min(10, partySize + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors text-slate-600 dark:text-slate-400 font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Transport Options */}
          <div className="space-y-3 lg:col-span-2">
            <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
              Transport Mode
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCarMode("none")}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-colors ${
                      carMode === "none"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    No Car
                  </button>
                  {showRental && (
                    <button
                      onClick={() => setCarMode("rental")}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-colors ${
                        carMode === "rental"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-400"
                      }`}
                    >
                      Rental
                    </button>
                  )}
                  {showMyCar && (
                    <button
                      onClick={() => setCarMode("my_car")}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-colors ${
                        carMode === "my_car"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-400"
                      }`}
                    >
                      My Car
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPublicModes(
                        publicModes.includes("train")
                          ? publicModes.filter((m) => m !== "train")
                          : [...publicModes, "train"],
                      )
                    }
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                      publicModes.includes("train")
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Train className="w-3.5 h-3.5" /> Train
                  </button>
                  <button
                    onClick={() =>
                      setPublicModes(
                        publicModes.includes("shinkansen")
                          ? publicModes.filter((m) => m !== "shinkansen")
                          : [...publicModes, "shinkansen"],
                      )
                    }
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                      publicModes.includes("shinkansen")
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <TrainFront className="w-3.5 h-3.5" /> Bullet
                  </button>
                  <button
                    onClick={() =>
                      setPublicModes(
                        publicModes.includes("bus")
                          ? publicModes.filter((m) => m !== "bus")
                          : [...publicModes, "bus"],
                      )
                    }
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                      publicModes.includes("bus")
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Bus className="w-3.5 h-3.5" /> Bus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
                Max Budget
              </label>
              <span className="text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md">
                ¥{maxBudget.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[maxBudget]}
              max={100000}
              step={5000}
              onValueChange={(val: number | readonly number[]) =>
                setMaxBudget(Array.isArray(val) ? val[0] : val)
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>¥0</span>
              <span>¥100k+</span>
            </div>
          </div>

          {/* Walking Slider */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold flex items-center text-slate-700 dark:text-slate-300">
                Max Walking
              </label>
              <span className="text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md">
                {maxWalking >= 25000
                  ? "Any amount"
                  : `${(maxWalking / 1000).toFixed(1)}k steps`}
              </span>
            </div>
            <Slider
              value={[maxWalking]}
              min={2000}
              max={25000}
              step={1000}
              onValueChange={(val: number | readonly number[]) =>
                setMaxWalking(Array.isArray(val) ? val[0] : val)
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>2k steps</span>
              <span>25k+</span>
            </div>
          </div>
        </div>

        {/* Action Bar: Reset & Primary Search CTA */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors h-11 flex items-center justify-center"
          >
            Reset Filters
          </button>
          {onSearch && (
            <button
              onClick={onSearch}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 h-11 flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Search Destinations</span>
              {typeof totalMatches === "number" && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {totalMatches}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
