import { Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { getCollections } from "@/shared/data/collections";
import {
  getDestinationsForCollection,
  getCollectionProgress,
} from "@/shared/utils/collections";
import CollectionBadge from "@/shared/components/ui/CollectionBadge";
import { ExternalLink, Layers, CheckCircle2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export default function CollectionsDirectory() {
  const collections = getCollections();
  const { visited } = useTripStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mb-4">
          <Layers className="w-4 h-4 text-emerald-500" />
          Curated Travel Guides
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Explore Curated Collections
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
          Discover Japan through hand-picked historical rankings, official
          UNESCO heritage lists, and legendary cultural landmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => {
          const destinations = getDestinationsForCollection(col.id);
          const progress = getCollectionProgress(col.id, visited);

          return (
            <div
              key={col.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <CollectionBadge collection={col} size="md" />
                  <Badge
                    variant="outline"
                    className="capitalize text-xs font-semibold"
                  >
                    {col.type} Collection
                  </Badge>
                </div>

                <Link
                  to={`/collections/${col.slug}`}
                  className="group block mb-3"
                >
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {col.name}
                  </h2>
                </Link>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {col.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                {/* Progress Bar & Stat */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {progress.visited} / {progress.total} visited
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {progress.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                {/* Footer Metadata & Link */}
                <div className="flex items-center justify-between text-xs font-medium pt-1">
                  {col.officialSource && col.sourceUrl ? (
                    <a
                      href={col.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate max-w-[60%]"
                    >
                      <ExternalLink className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{col.officialSource}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">
                      {destinations.length} Destinations
                    </span>
                  )}

                  <Link
                    to={`/collections/${col.slug}`}
                    className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                  >
                    View Collection →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
