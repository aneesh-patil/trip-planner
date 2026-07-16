import { Link } from "react-router-dom";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import DestinationCard from "@/components/destinations/DestinationCard";
import { useTripStore } from "@/hooks/useTripStore";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { favorites } = useTripStore();
  const allDestinations = destinationsData as Destination[];
  
  const favoriteDestinations = allDestinations.filter(d => favorites.includes(d.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
        <p className="text-slate-500 mt-1">Destinations you've saved for future planning.</p>
      </div>

      {favoriteDestinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No favorites yet</h3>
          <p className="text-slate-500 mb-6">Start exploring to save your dream weekend spots.</p>
          <Link to="/destinations">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="w-4 h-4 mr-2" /> Explore Destinations
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
