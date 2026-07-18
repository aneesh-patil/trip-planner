import { useTripStore } from "@/shared/hooks/useTripStore";
import { destinationService } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import DestinationCard from "@/features/destinations/components/DestinationCard";
import { Bookmark, Search, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export default function Favorites() {
  const { favorites, visited } = useTripStore();
  const allDestinations = destinationService.getDestinationList() as Destination[];
  
  const favoriteDestinations = allDestinations.filter(d => favorites.includes(d.id));
  const visitedDestinations = allDestinations.filter(d => visited.includes(d.id));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-10 border-b pb-6">
        <Bookmark className="w-8 h-8 mr-4 text-emerald-500" />
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Bucket List</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Places you want to visit around Tokyo</p>
        </div>
      </div>

      {favoriteDestinations.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Bookmark className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
          <h2 className="text-2xl font-bold mb-3">Your list is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Explore our curated destinations and tap the bookmark icon to save places you'd like to visit later.
          </p>
          <Link to="/destinations">
            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <Search className="w-4 h-4 mr-2" />
              Find Places to Go
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteDestinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}

      {visitedDestinations.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center mb-8 border-b pb-6">
            <CheckCircle2 className="w-8 h-8 mr-4 text-emerald-500" />
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Already Visited</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Places you've already conquered</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70 hover:opacity-100 transition-opacity">
            {visitedDestinations.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
