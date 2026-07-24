import { Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import collectionsIndex from "@/shared/data/collections-index.json";
import destinationsIndex from "@/shared/data/destinations-index.json";
import type { Collection } from "@/shared/types/collection";
import {
  Trophy,
  CheckCircle2,
  Castle,
  Landmark,
  Crown,
  Trees,
  Flame,
  Building,
  Sparkles,
  Tag,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Castle,
  Landmark,
  Crown,
  Trees,
  Flame,
  Building,
  Sparkles,
};

export function PassportBadges() {
  const { visited } = useTripStore();

  const achievementCollections = (collectionsIndex as Collection[]).filter(
    (c) => c.isAchievement === true,
  );

  const achievementStats = achievementCollections.map((col) => {
    const colDestinations = destinationsIndex.filter((d) =>
      d.collections?.some((m) => m.collectionId === col.id),
    );
    const visitedCount = colDestinations.filter((d) =>
      visited.includes(d.id),
    ).length;
    const totalMembers =
      col.metadata?.expectedMembers || colDestinations.length;
    const pct =
      totalMembers > 0
        ? Math.min(100, Math.round((visitedCount / totalMembers) * 100))
        : 0;
    const isCompleted = visitedCount >= totalMembers && totalMembers > 0;
    return {
      collection: col,
      visitedCount,
      totalMembers,
      pct,
      isCompleted,
    };
  });

  const completedAchievementsCount = achievementStats.filter(
    (s) => s.isCompleted,
  ).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            Passport Achievements & Badges
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Track progress across official heritage benchmarks & curated
            Japanese travel lists
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
            Unlocked
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedAchievementsCount} / {achievementCollections.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementStats.map(
          ({ collection, visitedCount, totalMembers, pct, isCompleted }) => {
            const Icon = ICON_MAP[collection.icon] || Tag;
            return (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-amber-500/50 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-700 text-amber-500 shadow-sm group-hover:scale-110 transition-transform shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {collection.name}
                    </span>
                  </div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 shrink-0">
                      {pct}%
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {visitedCount} / {totalMembers}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? "bg-amber-500 shadow-sm" : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          },
        )}
      </div>
    </div>
  );
}
