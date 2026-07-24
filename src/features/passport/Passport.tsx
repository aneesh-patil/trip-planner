import { useState } from "react";
import { Compass } from "lucide-react";
import type { PassportTab } from "./types";
import { PassportNav } from "./components/PassportNav";
import { PassportOverview } from "./components/PassportOverview";
import { PassportJapanMap } from "./components/PassportJapanMap";
import { PassportTimeline } from "./components/PassportTimeline";
import { PassportAchievements } from "./components/PassportAchievements";
import { PassportBadges } from "./components/PassportBadges";
import { PassportStatistics } from "./components/PassportStatistics";

export default function Passport() {
  const [activeTab, setActiveTab] = useState<PassportTab>("overview");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <Compass className="w-4 h-4" />
            Traveler Profile Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Travel Passport
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-sm md:text-base mt-1">
            Track your exploration progress, unlocked heritage achievements, and
            personal travel timeline across Japan.
          </p>
        </div>
      </div>

      {/* Taller Sticky Sub-Nav */}
      <PassportNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Active Section Content */}
      <main className="pt-4">
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
