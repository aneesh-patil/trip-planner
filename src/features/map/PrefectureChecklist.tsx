import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import Japan from "@react-map/japan";
import {
  Compass,
  CheckCircle2,
  Trophy,
  Castle,
  Landmark,
  Trees,
  Crown,
  Flame,
  Building,
  Sparkles,
  Tag,
} from "lucide-react";
import collectionsIndex from "@/shared/data/collections-index.json";
import destinationsIndex from "@/shared/data/destinations-index.json";
import type { Collection } from "@/shared/types/collection";

const ICON_MAP: Record<string, React.ElementType> = {
  Castle,
  Landmark,
  Crown,
  Trees,
  Flame,
  Building,
  Sparkles,
};

const REGIONS = [
  {
    name: "Hokkaido",
    prefectures: [{ id: "Hokkaido\x8D", name: "Hokkaido" }],
  },
  {
    name: "Tohoku",
    prefectures: [
      { id: "Aomori", name: "Aomori" },
      { id: "Iwate", name: "Iwate" },
      { id: "Miyagi", name: "Miyagi" },
      { id: "Akita", name: "Akita" },
      { id: "Yamagata", name: "Yamagata" },
      { id: "Fukushima", name: "Fukushima" },
    ],
  },
  {
    name: "Kanto",
    prefectures: [
      { id: "Ibaraki", name: "Ibaraki" },
      { id: "Tochigi", name: "Tochigi" },
      { id: "Gunma", name: "Gunma" },
      { id: "Saitama", name: "Saitama" },
      { id: "Chiba", name: "Chiba" },
      { id: "Tokyo", name: "Tokyo" },
      { id: "Kanagawa", name: "Kanagawa" },
    ],
  },
  {
    name: "Chubu",
    prefectures: [
      { id: "Niigata", name: "Niigata" },
      { id: "Toyama", name: "Toyama" },
      { id: "Ishikawa", name: "Ishikawa" },
      { id: "Fukui", name: "Fukui" },
      { id: "Yamanashi", name: "Yamanashi" },
      { id: "Nagano", name: "Nagano" },
      { id: "Gifu", name: "Gifu" },
      { id: "Shizuoka", name: "Shizuoka" },
      { id: "Aichi", name: "Aichi" },
    ],
  },
  {
    name: "Kansai",
    prefectures: [
      { id: "Mie", name: "Mie" },
      { id: "Shiga", name: "Shiga" },
      { id: "Kyoto", name: "Kyoto" },
      { id: "Osaka", name: "Osaka" },
      { id: "Hyogo", name: "Hyogo" },
      { id: "Nara", name: "Nara" },
      { id: "Wakayama", name: "Wakayama" },
    ],
  },
  {
    name: "Chugoku",
    prefectures: [
      { id: "Tottori", name: "Tottori" },
      { id: "Shimane", name: "Shimane" },
      { id: "Okayama", name: "Okayama" },
      { id: "Hiroshima", name: "Hiroshima" },
      { id: "Yamaguchi", name: "Yamaguchi" },
    ],
  },
  {
    name: "Shikoku",
    prefectures: [
      { id: "Tokushima", name: "Tokushima" },
      { id: "Kagawa", name: "Kagawa" },
      { id: "Ehime", name: "Ehime" },
      { id: "Kochi", name: "Kochi" },
    ],
  },
  {
    name: "Kyushu & Okinawa",
    prefectures: [
      { id: "Fukuoka", name: "Fukuoka" },
      { id: "Saga", name: "Saga" },
      { id: "Nagasaki", name: "Nagasaki" },
      { id: "Kumamoto", name: "Kumamoto" },
      { id: "Oita", name: "Oita" },
      { id: "Miyazaki", name: "Miyazaki" },
      { id: "Kagoshima", name: "Kagoshima" },
      { id: "Okinawa", name: "Okinawa" },
    ],
  },
];

export default function PrefectureChecklist() {
  const { visited, visitedPrefectures, isPrefectureVisited } = useTripStore();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mapSize = windowWidth < 640 ? Math.min(windowWidth - 80, 320) : 550;

  const cityColors = visitedPrefectures.reduce(
    (acc, pref) => {
      acc[pref] = "#10b981"; // emerald-500
      return acc;
    },
    {} as Record<string, string>,
  );

  // Compute Achievement Collection Progress
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Compass className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          Travel Passport
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-base">
          Your automated travel history and curated collection achievements
          across Japan.
        </p>
      </div>

      {/* Collection Achievements Section */}
      <div className="mb-12 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-amber-400" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2.5 text-amber-300">
                <Trophy className="w-6 h-6 text-amber-400" />
                Curated Collection Achievements
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Official heritage benchmarks & prestigious Japanese travel lists
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/60 self-start sm:self-auto">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Completed
              </span>
              <span className="text-lg font-extrabold text-amber-400">
                {completedAchievementsCount} / {achievementCollections.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievementStats.map(
              ({
                collection,
                visitedCount,
                totalMembers,
                pct,
                isCompleted,
              }) => {
                const Icon = ICON_MAP[collection.icon] || Tag;
                return (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.slug}`}
                    className="group block p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-amber-500/50 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-700/60 text-amber-400 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-300 truncate max-w-[130px]">
                          {collection.name}
                        </span>
                      </div>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="text-xs font-extrabold text-slate-400">
                          {pct}%
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 mt-3">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span className="font-semibold text-slate-200">
                          {visitedCount} / {totalMembers}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                              : "bg-amber-400"
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
      </div>

      {/* Main Grid: Read-Only Prefecture List & Derived Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Read-Only Derived Checklist */}
        <div className="space-y-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 lg:h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Prefecture Activity
            </h2>
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
              100% Derived from Visited Places
            </span>
          </div>

          {REGIONS.map((region) => (
            <div key={region.name} className="mb-6 last:mb-0">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                {region.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {region.prefectures.map((pref) => {
                  const visitedStatus = isPrefectureVisited(pref.id);
                  return (
                    <div
                      key={pref.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-sm transition-all ${
                        visitedStatus
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300 font-bold shadow-sm"
                          : "bg-slate-50 border-slate-200/80 text-slate-500 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <span className="truncate">{pref.name}</span>
                      {visitedStatus && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Derived Interactive Map */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[500px] lg:sticky lg:top-24">
          <div className="w-full h-full flex flex-col items-center">
            <div className="mb-4 text-center">
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                {visitedPrefectures.length}{" "}
                <span className="text-3xl text-slate-400">/ 47</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Prefectures Explored
              </div>
            </div>

            <div className="w-full max-w-[600px] aspect-square flex items-center justify-center">
              <Japan
                type="select-multiple"
                size={mapSize}
                mapColor="#cbd5e1"
                strokeColor="#ffffff"
                strokeWidth={1.5}
                hoverColor="#34d399"
                selectColor="#10b981"
                cityColors={cityColors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
