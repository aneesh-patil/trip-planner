import { useTripStore } from "@/shared/hooks/useTripStore";
import {
  Compass,
  MapPin,
  Trophy,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import collectionsIndex from "@/shared/data/collections-index.json";
import destinationsIndex from "@/shared/data/destinations-index.json";
import type { Collection } from "@/shared/types/collection";
import type { PassportTab } from "../types";

interface PassportOverviewProps {
  onSelectTab: (tab: PassportTab) => void;
}

export function PassportOverview({ onSelectTab }: PassportOverviewProps) {
  const { visited, visitedPrefectures, trips } = useTripStore();

  const achievementCollections = (collectionsIndex as Collection[]).filter(
    (c) => c.isAchievement === true,
  );

  const completedAchievementsCount = achievementCollections.filter((col) => {
    const colDestinations = destinationsIndex.filter((d) =>
      d.collections?.some((m) => m.collectionId === col.id),
    );
    const visitedCount = colDestinations.filter((d) =>
      visited.includes(d.id),
    ).length;
    const totalMembers =
      col.metadata?.expectedMembers || colDestinations.length;
    return totalMembers > 0 && visitedCount >= totalMembers;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* High Level Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Prefectures */}
        <div
          onClick={() => onSelectTab("japan-map")}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/80 dark:border-emerald-800/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-sm group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full">
              {Math.round((visitedPrefectures.length / 47) * 100)}% Japan
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {visitedPrefectures.length}{" "}
            <span className="text-base font-normal text-slate-500">/ 47</span>
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Prefectures Explored</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 2: Sights Visited */}
        <div
          onClick={() => onSelectTab("statistics")}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-blue-500 text-white shadow-sm group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 rounded-full">
              Total Logged
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {visited.length}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Visited Destinations</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 3: Achievements */}
        <div
          onClick={() => onSelectTab("achievements")}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/80 dark:border-amber-800/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-sm group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 rounded-full">
              Heritage Goals
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {completedAchievementsCount}{" "}
            <span className="text-base font-normal text-slate-500">
              / {achievementCollections.length}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Achievements Unlocked</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 4: Timeline */}
        <div
          onClick={() => onSelectTab("timeline")}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-200/80 dark:border-purple-800/60 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-purple-500 text-white shadow-sm group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 rounded-full">
              Timeline Feed
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {trips.length}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Travel Activity Log</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onSelectTab("japan-map")}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Explored Japan Map
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View your interactive prefecture map and check off visited regions.
          </p>
        </button>

        <button
          onClick={() => onSelectTab("achievements")}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Heritage Achievements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your progress across UNESCO World Heritage sites & Japanese
            top lists.
          </p>
        </button>

        <button
          onClick={() => onSelectTab("badges")}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Milestone Badges
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Earn badges as you explore Japan's regions and log new places.
          </p>
        </button>
      </div>
    </div>
  );
}
