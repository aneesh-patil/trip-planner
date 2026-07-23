import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { getDestinationList } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import DestinationCard from "@/features/destinations/components/DestinationCard";
import TripCard from "@/features/trips/components/TripCard";
import TripEditor from "@/features/trips/components/TripEditor";
import TripDetails from "@/features/trips/TripDetails";
import {
  CheckCircle2,
  Compass,
  MapPin,
  Search,
  Sparkles,
  Plus,
  Calendar,
  ListTodo,
  Bookmark,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function MyTrips() {
  const {
    visited,
    visitedPrefectures,
    favorites,
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
    addStopToTrip,
    removeStopFromTrip,
    reorderTripStops,
  } = useTripStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const paramTab = searchParams.get("tab");
  const paramTripId = searchParams.get("tripId");

  const [activeTab, setActiveTab] = useState<
    "planned" | "bucketlist" | "visited"
  >("planned");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [visitedSearchQuery, setVisitedSearchQuery] = useState("");

  useEffect(() => {
    if (
      paramTab === "bucketlist" ||
      paramTab === "visited" ||
      paramTab === "planned"
    ) {
      setActiveTab(paramTab);
    }
    if (paramTripId) {
      setSelectedTripId(paramTripId);
    }
  }, [paramTab, paramTripId]);

  const allDestinations = getDestinationList() as Destination[];

  const visitedDestinations = allDestinations.filter((d) =>
    visited.includes(d.id),
  );

  const favoriteDestinations = allDestinations.filter((d) =>
    favorites.includes(d.id),
  );

  const filteredVisited = visitedDestinations.filter(
    (d) =>
      d.name.toLowerCase().includes(visitedSearchQuery.toLowerCase().trim()) ||
      d.prefecture
        .toLowerCase()
        .includes(visitedSearchQuery.toLowerCase().trim()) ||
      d.tags.some((t) =>
        t.toLowerCase().includes(visitedSearchQuery.toLowerCase().trim()),
      ),
  );

  const totalDestinations = allDestinations.length;
  const progressPercent = Math.round(
    (visitedDestinations.length / totalDestinations) * 100,
  );

  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  // If a specific trip planner is open, render its detailed editor
  if (selectedTrip) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <TripDetails
          trip={selectedTrip}
          onBack={() => setSelectedTripId(null)}
          onUpdateTrip={(updates) => updateTrip(selectedTrip.id, updates)}
          onAddStop={(stop) => addStopToTrip(selectedTrip.id, stop)}
          onRemoveStop={(stopId) => removeStopFromTrip(selectedTrip.id, stopId)}
          onReorderStops={(start, end) =>
            reorderTripStops(selectedTrip.id, start, end)
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-200 dark:border-slate-800 pb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Explorer Dashboard</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Trips & History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base max-w-xl">
            Plan new travel itineraries or review all the incredible
            destinations across Japan you have explored.
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

      {/* Tabs Switcher */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-8">
        <button
          onClick={() => {
            setActiveTab("planned");
            setSearchParams({});
          }}
          className={`pb-4 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === "planned"
              ? "border-emerald-500 text-slate-900 dark:text-white"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Itineraries ({trips.length})</span>
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab("bucketlist");
            setSearchParams({ tab: "bucketlist" });
          }}
          className={`pb-4 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === "bucketlist"
              ? "border-emerald-500 text-slate-900 dark:text-white"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" />
            <span>Bucket List ({favorites.length})</span>
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab("visited");
            setSearchParams({ tab: "visited" });
          }}
          className={`pb-4 px-2 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === "visited"
              ? "border-emerald-500 text-slate-900 dark:text-white"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ListTodo className="w-4 h-4" />
            <span>Visited Places ({visitedDestinations.length})</span>
          </div>
        </button>
      </div>

      {/* Planned Itineraries Tab */}
      {activeTab === "planned" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              My Travel Itineraries
            </h2>
            <Button
              onClick={() => setIsAddingTrip(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-6 shadow-md"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Create New Trip</span>
            </Button>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
              <Compass className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No planned itineraries yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Start planning your next adventure in Japan! You can define
                dates, add multiple destination stops, and write travel diaries.
              </p>
              <Button
                onClick={() => setIsAddingTrip(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-8 shadow-md"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Create Your First Itinerary</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onSelect={(id) => setSelectedTripId(id)}
                  onDelete={(id) => deleteTrip(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bucket List Tab */}
      {activeTab === "bucketlist" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Your Bucket List
            </h2>
          </div>

          {favoriteDestinations.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
              <Bookmark className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Your Bucket List is empty
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Explore our curated destinations and tap the bookmark icon to
                save places you would like to visit later.
              </p>
              <Link to="/destinations">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-8 shadow-md">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore Destinations
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visited Places Tab */}
      {activeTab === "visited" && (
        <div className="space-y-6">
          {visitedDestinations.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search your visited places..."
                  value={visitedSearchQuery}
                  onChange={(e) => setVisitedSearchQuery(e.target.value)}
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
                No visited places match "{visitedSearchQuery}"
              </p>
              <button
                onClick={() => setVisitedSearchQuery("")}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVisited.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Trip Overlay Modal */}
      {isAddingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full relative shadow-xl mx-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Plan New Itinerary
            </h3>
            <TripEditor
              onSave={(title, start, end) => {
                addTrip(title, start, end);
                setIsAddingTrip(false);
              }}
              onCancel={() => setIsAddingTrip(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
