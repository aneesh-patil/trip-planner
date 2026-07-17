import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationFilters from "@/components/destinations/DestinationFilters";
import DestinationMap from "@/components/destinations/DestinationMap";
import { Frown, Map as MapIcon, Grid } from "lucide-react";

export default function Destinations() {
  const allDestinations = destinationsData as Destination[];
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(100000);
  const [sortBy, setSortBy] = useState("overall");
  const [transportMode, setTransportMode] = useState("all");
  const [weather, setWeather] = useState("all");
  const [maxWalking, setMaxWalking] = useState(25000);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Setup Fuse.js for fuzzy searching
  const fuse = useMemo(() => new Fuse(allDestinations, {
    keys: ["name", "prefecture", "region", "tags", "categories", "highlights"],
    threshold: 0.3,
  }), [allDestinations]);

  // Filter and sort destinations
  const filteredAndSortedDestinations = useMemo(() => {
    let result = allDestinations;

    // 1. Search
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map(res => res.item);
    }

    // 2. Filter by budget
    result = result.filter(dest => dest.budgetRecommended <= maxBudget);

    // 3. Filter by Transport
    if (transportMode === "train") {
      result = result.filter(dest => dest.trainAvailable);
    } else if (transportMode === "car") {
      result = result.filter(dest => dest.carRecommended || !dest.trainAvailable);
    }

    // 4. Filter by Weather
    if (weather === "indoor") {
      result = result.filter(dest => dest.indoorPercent >= 50 || dest.ratings.rain >= 8);
    } else if (weather === "summer") {
      result = result.filter(dest => dest.ratings.summer >= 8);
    }

    // 5. Filter by Max Walking
    result = result.filter(dest => dest.walkingMin <= maxWalking);

    // 6. Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "budget":
          return a.budgetRecommended - b.budgetRecommended;
        case "travelTime":
          const aTime = a.trainAvailable ? a.trainTimeMin : a.carTimeMin;
          const bTime = b.trainAvailable ? b.trainTimeMin : b.carTimeMin;
          return aTime - bTime;
        case "walking":
          return a.walkingMin - b.walkingMin;
        case "couple":
          return b.ratings.couple - a.ratings.couple;
        case "summer":
          return b.ratings.summer - a.ratings.summer;
        case "overall":
        default:
          return b.ratings.overall - a.ratings.overall;
      }
    });

    return result;
  }, [allDestinations, searchQuery, maxBudget, sortBy, transportMode, weather, maxWalking, fuse]);

  const resetFilters = () => {
    setSearchQuery("");
    setMaxBudget(100000);
    setSortBy("overall");
    setTransportMode("all");
    setWeather("all");
    setMaxWalking(25000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Explore Destinations</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Find the perfect day trip from Nakayama Station. Filter by budget, travel time, and what kind of experience you want.
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode("grid")}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "grid" 
                ? "bg-white dark:bg-slate-900 shadow-sm text-emerald-600" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </button>
          <button 
            onClick={() => setViewMode("map")}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "map" 
                ? "bg-white dark:bg-slate-900 shadow-sm text-emerald-600" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Map
          </button>
        </div>
      </div>

      <DestinationFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        maxBudget={maxBudget}
        setMaxBudget={setMaxBudget}
        sortBy={sortBy}
        setSortBy={setSortBy}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        weather={weather}
        setWeather={setWeather}
        maxWalking={maxWalking}
        setMaxWalking={setMaxWalking}
        onReset={resetFilters}
      />

      {filteredAndSortedDestinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Frown className="w-12 h-12 mb-4 text-slate-400" />
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">No destinations found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      ) : viewMode === "map" ? (
        <DestinationMap destinations={filteredAndSortedDestinations} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
