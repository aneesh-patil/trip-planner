import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { getDestinationList } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import { X, MapPin, CheckCircle2, Compass, Star, Trash2 } from "lucide-react";

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyTripsModal({ isOpen, onClose }: MyTripsModalProps) {
  const { visited, toggleVisited, visitedPrefectures } = useTripStore();
  const allDestinations = getDestinationList() as Destination[];

  const visitedDestinations = allDestinations.filter((d) =>
    visited.includes(d.id),
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                My Visited Trips
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {visitedDestinations.length} destination
                {visitedDestinations.length === 1 ? "" : "s"} across{" "}
                {visitedPrefectures.length} prefecture
                {visitedPrefectures.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {visitedDestinations.length === 0 ? (
            <div className="text-center py-16">
              <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                No visited trips recorded yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                When you explore a destination, tap the checkmark icon on its
                card to record it in your visited history.
              </p>
              <Link to="/destinations" onClick={onClose}>
                <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                  Browse Destinations
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visitedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-emerald-500/50 hover:shadow-md transition-all"
                >
                  <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {dest.heroImage ? (
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <MapPin className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Visited
                    </div>

                    <button
                      onClick={() => toggleVisited(dest.id)}
                      title="Remove from visited"
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/80 hover:text-red-400 hover:bg-black/80 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <p className="text-[10px] font-medium text-emerald-300 uppercase tracking-wider">
                        {dest.prefecture}
                      </p>
                      <h4 className="text-base font-bold leading-tight truncate">
                        {dest.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dest.ratings?.overall?.toFixed(1) || "4.5"}</span>
                    </div>

                    <Link
                      to={`/destinations/${dest.id}`}
                      onClick={onClose}
                      className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
