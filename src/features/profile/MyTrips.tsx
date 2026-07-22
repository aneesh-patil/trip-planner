import { useState } from "react";
import { Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { getDestinationList } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import DestinationCard from "@/features/destinations/components/DestinationCard";
import { CheckCircle2, Compass, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function MyTrips() {
  const { visited, visitedPrefectures } = useTripStore();
  const allDestinations = getDestinationList() as Destination[];
  const [searchQuery, setSearchQuery] = useState("");

  const visitedDestinations = allDestinations.filter((d) =>
    visited.includes(d.id),
  );

  const filteredVisited = visitedDestinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      d.prefecture.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      d.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      ),
  );

  const totalDestinations = allDestinations.length;
  const progressPercent = Math.round(
    (visitedDestinations.length / totalDestinations) * 100,
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-200 dark:border-slate-800 pb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Travel History</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Visited Trips
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base max-w-xl">
            Track and review all the incredible destinations across Japan you
            have explored.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {visitedDestinations.length}
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Places Visited
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center">
            <p className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {visitedPrefectures.length}
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Prefectures
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-center">
            <p className="text-2xl font-black text-amber-500">
              {progressPercent}%
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
              Explored
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      {visitedDestinations.length > 0 && (
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search your visited places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
            />
          </div>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredVisited.length} of {visitedDestinations.length}{" "}
            visited place
            {visitedDestinations.length === 1 ? "" : "s"}
          </p>
        </div>
      )}

      {/* Empty State */}
      {visitedDestinations.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
          <Compass className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            No visited trips recorded yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            As you travel and explore destinations across Japan, tap the
            checkmark icon on any destination card to mark it as visited!
          </p>
          <Link to="/destinations">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-8 shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Destinations
            </Button>
          </Link>
        </div>
      ) : filteredVisited.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">
            No visited places match "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Destination Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVisited.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
