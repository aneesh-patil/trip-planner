import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationFilters from "@/components/destinations/DestinationFilters";
import { Frown } from "lucide-react";

export default function Destinations() {
  const allDestinations = destinationsData as Destination[];
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(80000);
  const [sortBy, setSortBy] = useState("overall");

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

    // 3. Sort
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
  }, [allDestinations, searchQuery, maxBudget, sortBy, fuse]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Destinations</h1>
        <p className="text-slate-500 mt-1">Browse and filter perfect weekend spots.</p>
      </div>

      <DestinationFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        maxBudget={maxBudget}
        setMaxBudget={setMaxBudget}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {filteredAndSortedDestinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Frown className="w-12 h-12 mb-4 text-slate-400" />
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">No destinations found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
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
