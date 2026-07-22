import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Search,
  Utensils,
  Trees,
  Palette,
  Camera,
  Sun,
  CloudRain,
  ThermometerSun,
  Navigation,
  Waves,
  Landmark,
  Snowflake,
  Calendar,
  Dices,
} from "lucide-react";
import { getDestinationList } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import DestinationCard from "@/features/destinations/components/DestinationCard";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  fetchWeatherTabContext,
  getTabWeatherSummary,
  type WeatherTabContext,
  type WeatherTab,
} from "@/shared/services/weather/WeatherTabService";
import {
  getRecommendations,
  getValidModes,
} from "@/shared/services/recommendation/RecommendationService";
import StationInput from "@/shared/components/StationInput";
import RouletteModal from "@/features/home/components/RouletteModal";

export default function Home() {
  const allDestinations = getDestinationList() as Destination[];

  const { isVisited, homeStationCoords } = useTripStore();
  const { user } = useAuth();

  // Smart Planner State
  const [tripType, setTripType] = useState<string>("any");
  const [budget, setBudget] = useState<number>(30000);
  const [carMode, setCarMode] = useState<string>("none");
  const [publicModes, setPublicModes] = useState<string[]>(["train"]);
  const [partySize, setPartySize] = useState<number>(2);
  const [weather, setWeather] = useState<string>("any");

  // Sync preferences on load
  useEffect(() => {
    if (user?.user_metadata?.preferences) {
      setCarMode(user.user_metadata.preferences.carMode || "none");
      setPublicModes(user.user_metadata.preferences.publicModes || ["train"]);
      setPartySize(user.user_metadata.preferences.partySize || 2);
    }
  }, [user]);

  const [weatherContext, setWeatherContext] =
    useState<WeatherTabContext | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>("today");
  const [customDate, setCustomDate] = useState<string | null>(null);

  useEffect(() => {
    const lat = homeStationCoords?.lat || 35.6762;
    const lng = homeStationCoords?.lng || 139.6503;
    fetchWeatherTabContext(lat, lng)
      .then((ctx) => {
        setWeatherContext(ctx);
        setActiveTabId(ctx.activeTabId);
      })
      .catch((err) => console.error("Weather tab fetch error:", err));
  }, [homeStationCoords]);

  const handleCustomDateSelect = (selectedDate: string) => {
    if (!weatherContext) return;
    const matchingPreset = weatherContext.tabs.find((t) =>
      t.dates.includes(selectedDate),
    );
    if (matchingPreset) {
      setActiveTabId(matchingPreset.id);
    } else {
      const customTabId = `custom_${selectedDate}`;
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      const label = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const customTab: WeatherTab = {
        id: customTabId,
        label,
        dates: [selectedDate],
        isCustom: true,
      };

      const exists = weatherContext.tabs.some((t) => t.id === customTabId);
      if (!exists) {
        setWeatherContext({
          ...weatherContext,
          tabs: [...weatherContext.tabs, customTab],
        });
      }
      setActiveTabId(customTabId);
    }
  };

  const currentTab = useMemo(() => {
    if (!weatherContext) return null;
    return (
      weatherContext.tabs.find((t) => t.id === activeTabId) ||
      weatherContext.tabs[0]
    );
  }, [weatherContext, activeTabId]);

  const currentSituation = useMemo(() => {
    if (!weatherContext || !currentTab) return null;
    return getTabWeatherSummary(currentTab, weatherContext.forecastMap);
  }, [weatherContext, currentTab]);

  // Calculate Smart Match Score using the new service
  const scoredDestinations = useMemo(() => {
    return getRecommendations(allDestinations, {
      tripType,
      budget,
      carMode,
      publicModes,
      partySize,
      weather,
      visitedIds: allDestinations
        .filter((d) => isVisited(d.id!))
        .map((d) => d.id!),
      currentWeather: currentSituation
        ? {
            temp: currentSituation.temp,
            desc: currentSituation.desc,
          }
        : null,
      homeStationCoords: homeStationCoords || null,
    });
  }, [
    allDestinations,
    tripType,
    budget,
    carMode,
    publicModes,
    partySize,
    weather,
    isVisited,
    currentSituation,
    homeStationCoords,
  ]);

  const [rouletteOpen, setRouletteOpen] = useState(false);

  const rouletteCandidates = useMemo(() => {
    return scoredDestinations.filter((dest) => {
      if (isVisited(dest.id!)) return false;
      const validModes = getValidModes(dest, carMode, publicModes);
      if (validModes.length === 0) return false;
      return true;
    });
  }, [scoredDestinations, isVisited, carMode, publicModes]);

  const topRecommendations = scoredDestinations.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero & Planner Section */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contextual Hero */}
            <div className="flex flex-col items-start text-left w-full">
              <div className="mb-6">
                <StationInput />
              </div>
              {currentSituation ? (
                <div className="mb-10 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {weatherContext?.tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all focus:outline-none ${
                          activeTabId === tab.id
                            ? "bg-emerald-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}

                    {/* Custom Date Picker (Bounded to Open-Meteo 10-day forecast) */}
                    {weatherContext && (
                      <div className="relative inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:border-emerald-500 transition-colors">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <input
                          type="date"
                          min={weatherContext.minDate}
                          max={weatherContext.maxDate}
                          value={customDate || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              setCustomDate(val);
                              handleCustomDateSelect(val);
                            }
                          }}
                          className="bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                          title="Pick custom forecast date"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 font-bold mb-2 tracking-widest uppercase text-xs">
                    {currentSituation.dateLabel}
                  </p>
                  <div className="flex items-center text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                    <span>{currentSituation.temp}°C</span>
                    <span className="mx-4 text-slate-200 dark:text-slate-800">
                      |
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                      {currentSituation.desc} in your area
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mt-6 leading-tight">
                    Based on{" "}
                    {currentTab?.label.toLowerCase() === "today"
                      ? "today's"
                      : currentTab?.label.toLowerCase() === "tomorrow"
                        ? "tomorrow's"
                        : `${currentTab?.label.toLowerCase() || "upcoming"}`}{" "}
                    conditions,
                    <br />
                    you should go to...
                  </h1>
                </div>
              ) : (
                <div className="h-40 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-lg mb-10" />
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-6 text-base font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xl"
                  onClick={() =>
                    document
                      .getElementById("recommendations")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reveal Top Match
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setRouletteOpen(true)}
                  className="w-full sm:w-auto h-14 px-6 text-base font-bold rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                >
                  <Dices className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Surprise Me 🎲
                </Button>
                <Link to="/destinations" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 px-6 text-base font-bold rounded-full bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 border-slate-300 hover:bg-slate-100"
                  >
                    Browse All
                  </Button>
                </Link>
              </div>
            </div>

            <RouletteModal
              isOpen={rouletteOpen}
              onClose={() => setRouletteOpen(false)}
              candidates={rouletteCandidates}
            />

            {/* Smart Planner Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative">
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform rotate-3">
                Find your trip in 30s
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
                <Navigation className="w-6 h-6 mr-2 text-emerald-500" />
                Trip Planner
              </h3>

              <div className="space-y-6">
                {/* Trip Type */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    What's the vibe?
                  </label>
                  <Select
                    value={tripType}
                    onValueChange={(val: string | null) => {
                      if (val) setTripType(val);
                    }}
                  >
                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
                      {tripType === "any" && (
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-3 text-slate-400" />{" "}
                          Anything goes
                        </div>
                      )}
                      {tripType === "themepark" && (
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-3 text-pink-500" />{" "}
                          Theme Parks
                        </div>
                      )}
                      {tripType === "sea" && (
                        <div className="flex items-center">
                          <Waves className="w-5 h-5 mr-3 text-blue-500" /> Sea
                          Escape
                        </div>
                      )}
                      {tripType === "history" && (
                        <div className="flex items-center">
                          <Landmark className="w-5 h-5 mr-3 text-amber-700" />{" "}
                          History & Culture
                        </div>
                      )}
                      {tripType === "art" && (
                        <div className="flex items-center">
                          <Palette className="w-5 h-5 mr-3 text-purple-500" />{" "}
                          Art & Museums
                        </div>
                      )}
                      {tripType === "food" && (
                        <div className="flex items-center">
                          <Utensils className="w-5 h-5 mr-3 text-orange-500" />{" "}
                          Food & Eating
                        </div>
                      )}
                      {tripType === "nature" && (
                        <div className="flex items-center">
                          <Trees className="w-5 h-5 mr-3 text-emerald-500" />{" "}
                          Nature & Outdoors
                        </div>
                      )}
                      {tripType === "cool" && (
                        <div className="flex items-center">
                          <Snowflake className="w-5 h-5 mr-3 text-sky-400" />{" "}
                          Cool Escape
                        </div>
                      )}
                      {tripType === "photography" && (
                        <div className="flex items-center">
                          <Camera className="w-5 h-5 mr-3 text-rose-400" />{" "}
                          Photography
                        </div>
                      )}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
                      <SelectItem
                        value="any"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-3 text-slate-400" />{" "}
                          <span className="text-base font-medium">
                            Anything goes
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="themepark"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-3 text-pink-500" />{" "}
                          <span className="text-base font-medium">
                            Theme Parks
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="sea"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Waves className="w-5 h-5 mr-3 text-blue-500" />{" "}
                          <span className="text-base font-medium">
                            Sea Escape
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="history"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Landmark className="w-5 h-5 mr-3 text-amber-700" />{" "}
                          <span className="text-base font-medium">
                            History & Culture
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="art"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Palette className="w-5 h-5 mr-3 text-purple-500" />{" "}
                          <span className="text-base font-medium">
                            Art & Museums
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="food"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Utensils className="w-5 h-5 mr-3 text-orange-500" />{" "}
                          <span className="text-base font-medium">
                            Food & Eating
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="nature"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Trees className="w-5 h-5 mr-3 text-emerald-500" />{" "}
                          <span className="text-base font-medium">
                            Nature & Outdoors
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="cool"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Snowflake className="w-5 h-5 mr-3 text-sky-400" />{" "}
                          <span className="text-base font-medium">
                            Cool Escape
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="photography"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Camera className="w-5 h-5 mr-3 text-rose-400" />{" "}
                          <span className="text-base font-medium">
                            Photography
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weather */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Weather condition?
                  </label>
                  <Select
                    value={weather}
                    onValueChange={(val: string | null) => {
                      if (val) setWeather(val);
                    }}
                  >
                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
                      {weather === "any" && (
                        <div className="flex items-center">
                          <Sun className="w-5 h-5 mr-3 text-amber-500" />{" "}
                          Perfect Weather
                        </div>
                      )}
                      {weather === "rainy" && (
                        <div className="flex items-center">
                          <CloudRain className="w-5 h-5 mr-3 text-blue-500" />{" "}
                          Looks like Rain
                        </div>
                      )}
                      {weather === "summer" && (
                        <div className="flex items-center">
                          <ThermometerSun className="w-5 h-5 mr-3 text-red-500" />{" "}
                          Scorching Hot
                        </div>
                      )}
                      {weather === "winter" && (
                        <div className="flex items-center">
                          <Snowflake className="w-5 h-5 mr-3 text-sky-400" />{" "}
                          Freezing Cold
                        </div>
                      )}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
                      <SelectItem
                        value="any"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Sun className="w-5 h-5 mr-3 text-amber-500" />{" "}
                          <span className="text-base font-medium">
                            Perfect Weather
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="rainy"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <CloudRain className="w-5 h-5 mr-3 text-blue-500" />{" "}
                          <span className="text-base font-medium">
                            Looks like Rain
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="summer"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <ThermometerSun className="w-5 h-5 mr-3 text-red-500" />{" "}
                          <span className="text-base font-medium">
                            Scorching Hot
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="winter"
                        className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Snowflake className="w-5 h-5 mr-3 text-sky-400" />{" "}
                          <span className="text-base font-medium">
                            Freezing Cold
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Max Budget (couple)
                    </label>
                    <span className="text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md">
                      ¥{budget.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[budget]}
                    max={100000}
                    step={5000}
                    onValueChange={(val: number | readonly number[]) =>
                      setBudget(Array.isArray(val) ? val[0] : val)
                    }
                    className="w-full"
                  />
                </div>

                <Button
                  className="w-full h-12 mt-4 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  onClick={() => {
                    document
                      .getElementById("recommendations")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find My Match
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Recommendations */}
      <section
        id="recommendations"
        className="py-20 bg-white dark:bg-background"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Your Top Matches
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Ranked by our algorithm based on your preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRecommendations.map((dest, index) => (
              <div key={dest.id} className="relative flex flex-col h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-black text-xl z-10 shadow-lg border-4 border-white dark:border-background">
                  #{index + 1}
                </div>
                <div className="flex-grow">
                  <DestinationCard
                    destination={dest as Destination}
                    partySize={partySize}
                    carMode={carMode}
                    publicModes={publicModes}
                    activeTransportMode={
                      (dest as any).bestTransportMode || "train"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
