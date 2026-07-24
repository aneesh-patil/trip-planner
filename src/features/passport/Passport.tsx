import { useState } from "react";
import { Compass, MapPin, Trophy } from "lucide-react";
import { useTripStore } from "@/shared/hooks/useTripStore";
import collectionsIndex from "@/shared/data/collections-index.json";
import destinationsIndex from "@/shared/data/destinations-index.json";
import type { Collection } from "@/shared/types/collection";

import type { PassportTab } from "./types";
import { PassportNav } from "./components/PassportNav";
import { PassportOverview } from "./components/PassportOverview";
import { PassportJapanMap } from "./components/PassportJapanMap";
import { PassportTimeline } from "./components/PassportTimeline";
import { PassportAchievements } from "./components/PassportAchievements";
import { PassportBadges } from "./components/PassportBadges";
import { PassportStatistics } from "./components/PassportStatistics";

export default function Passport() {
  const { visited, visitedPrefectures } = useTripStore();
  const [activeTab, setActiveTab] = useState<PassportTab>("overview");

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
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Compass className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Travel Passport
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base">
            Your personal travel activity log and curated heritage achievements
            across Japan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Prefectures
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {visitedPrefectures.length}{" "}
                <span className="text-xs text-slate-400">/ 47</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Achievements
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {completedAchievementsCount}{" "}
                <span className="text-xs text-slate-400">
                  / {achievementCollections.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Segmented Control Sub-Nav */}
      <PassportNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Active Section Content */}
      <main className="pt-2">
        {activeTab === "overview" && (
          <PassportOverview onSelectTab={setActiveTab} />
        )}
        {activeTab === "japan-map" && <PassportJapanMap />}
        {activeTab === "timeline" && <PassportTimeline />}
        {activeTab === "achievements" && <PassportAchievements />}
        {activeTab === "badges" && <PassportBadges />}
        {activeTab === "statistics" && <PassportStatistics />}
      </main>
    </div>
  );
}
