import { useState, useMemo, useEffect } from "react";

import { destinationService } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import DestinationCard from "@/features/destinations/components/DestinationCard";
import DestinationFilters from "@/features/destinations/components/DestinationFilters";
import DestinationMap from "@/features/destinations/components/DestinationMap";
import {
  Frown,
  Map as MapIcon,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAdjustedBudget } from "@/shared/utils/utils";

export default function Destinations() {
  const allDestinations =
    destinationService.getDestinationList() as Destination[];
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(100000);
  const [sortBy, setSortBy] = useState("overall");
  const [transportMode, setTransportMode] = useState("all");
  const [weather, setWeather] = useState("all");
  const [maxWalking, setMaxWalking] = useState(25000);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const query = searchQuery.toLowerCase().trim();

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, maxBudget, sortBy, transportMode, weather, maxWalking]);

  // Filter and sort destinations
  const filteredAndSortedDestinations = useMemo(() => {
    let result = allDestinations;

    // 1. Search
    if (query) {
      result = result.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) ||
          dest.prefecture.toLowerCase().includes(query) ||
          dest.region.toLowerCase().includes(query) ||
          (dest.tags ?? []).some((t) => t.toLowerCase().includes(query)) ||
          (dest.categories ?? []).some((c) =>
            c.toLowerCase().includes(query),
          ) ||
          (dest.highlights ?? []).some((h) => h.toLowerCase().includes(query)),
      );
    }

    // 2. Filter by budget
    result = result.filter(
      (dest) => getAdjustedBudget(dest, transportMode) <= maxBudget,
    );

    // 3. Filter by Transport
    if (transportMode && transportMode !== "all") {
      result = result.filter(
        (dest) =>
          dest.transportOptions &&
          dest.transportOptions[
            transportMode as keyof typeof dest.transportOptions
          ] !== undefined,
      );
    }

    // 4. Filter by Weather
    if (weather === "indoor") {
      result = result.filter(
        (dest) => dest.indoorPercent >= 50 || dest.ratings.rain >= 8,
      );
    } else if (weather === "summer") {
      result = result.filter((dest) => dest.ratings.summer >= 8);
    } else if (weather === "winter") {
      result = result.filter((dest) => dest.ratings.winter >= 8);
    }

    // 5. Filter by Max Walking
    result = result.filter((dest) => dest.walkingMin <= maxWalking);

    // 6. Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "budget":
          return (
            getAdjustedBudget(a, transportMode) -
            getAdjustedBudget(b, transportMode)
          );
        case "travelTime":
          const getFastestTime = (dest: Destination) => {
            const times = Object.values(dest.transportOptions || {}).filter(
              (t): t is number => t !== undefined,
            );
            return times.length > 0 ? Math.min(...times) : 999;
          };
          const aTime =
            transportMode !== "all" &&
            a.transportOptions &&
            a.transportOptions[transportMode as keyof typeof a.transportOptions]
              ? a.transportOptions[
                  transportMode as keyof typeof a.transportOptions
                ]!
              : getFastestTime(a);
          const bTime =
            transportMode !== "all" &&
            b.transportOptions &&
            b.transportOptions[transportMode as keyof typeof b.transportOptions]
              ? b.transportOptions[
                  transportMode as keyof typeof b.transportOptions
                ]!
              : getFastestTime(b);
          return aTime - bTime;
        case "walking":
          return a.walkingMin - b.walkingMin;
        case "couple":
          return b.ratings.couple - a.ratings.couple;
        case "summer":
          return b.ratings.summer - a.ratings.summer;
        case "winter":
          return b.ratings.winter - a.ratings.winter;
        case "overall":
        default:
          return b.ratings.overall - a.ratings.overall;
      }
    });

    return result;
  }, [
    allDestinations,
    query,
    maxBudget,
    sortBy,
    transportMode,
    weather,
    maxWalking,
  ]);

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
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Explore Destinations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Find the perfect day trip from Nakayama Station. Filter by budget,
            travel time, and what kind of experience you want.
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

      <div className="mb-6 flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
        <span>
          Found {filteredAndSortedDestinations.length} destination
          {filteredAndSortedDestinations.length === 1 ? "" : "s"}
        </span>
      </div>

      {filteredAndSortedDestinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Frown className="w-12 h-12 mb-4 text-slate-400" />
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">
            No destinations found
          </h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      ) : viewMode === "map" ? (
        <DestinationMap destinations={filteredAndSortedDestinations} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedDestinations
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE,
              )
              .map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  activeTransportMode={transportMode}
                />
              ))}
          </div>

          {/* Pagination Controls */}
          {filteredAndSortedDestinations.length > ITEMS_PER_PAGE && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({
                  length: Math.ceil(
                    filteredAndSortedDestinations.length / ITEMS_PER_PAGE,
                  ),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === i + 1
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(
                        filteredAndSortedDestinations.length / ITEMS_PER_PAGE,
                      ),
                      p + 1,
                    ),
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(
                    filteredAndSortedDestinations.length / ITEMS_PER_PAGE,
                  )
                }
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
