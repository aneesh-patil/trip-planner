import { useTripStore } from "@/shared/hooks/useTripStore";
import {
  Award,
  CheckCircle2,
  Lock,
  Compass,
  MapPin,
  Flame,
  Crown,
  Sparkles,
  Mountain,
  Footprints,
} from "lucide-react";

interface BadgeDefinition {
  id: string;
  name: string;
  category: "Milestones" | "Regions";
  description: string;
  icon: React.ElementType;
  isUnlocked: boolean;
  progressText: string;
}

export function PassportBadges() {
  const { visited, visitedPrefectures } = useTripStore();

  const REGIONS_PREFECTURES: Record<string, string[]> = {
    Hokkaido: ["Hokkaido"],
    Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
    Kanto: [
      "Ibaraki",
      "Tochigi",
      "Gunma",
      "Saitama",
      "Chiba",
      "Tokyo",
      "Kanagawa",
    ],
    Chubu: [
      "Niigata",
      "Toyama",
      "Ishikawa",
      "Fukui",
      "Yamanashi",
      "Nagano",
      "Gifu",
      "Shizuoka",
      "Aichi",
    ],
    Kansai: ["Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama"],
    Chugoku: ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
    Shikoku: ["Tokushima", "Kagawa", "Ehime", "Kochi"],
    Kyushu: [
      "Fukuoka",
      "Saga",
      "Nagasaki",
      "Kumamoto",
      "Oita",
      "Miyazaki",
      "Kagoshima",
      "Okinawa",
    ],
  };

  const getRegionCount = (regionName: string) => {
    const prefList = REGIONS_PREFECTURES[regionName] || [];
    return prefList.filter((p) => visitedPrefectures.includes(p)).length;
  };

  const badges: BadgeDefinition[] = [
    // Milestones
    {
      id: "first-step",
      name: "First Step",
      category: "Milestones",
      description: "Log your first visited destination in Japan",
      icon: Footprints,
      isUnlocked: visited.length >= 1,
      progressText: `${Math.min(visited.length, 1)} / 1`,
    },
    {
      id: "traveler",
      name: "Traveler",
      category: "Milestones",
      description: "Visit 5 different destinations across Japan",
      icon: Compass,
      isUnlocked: visited.length >= 5,
      progressText: `${Math.min(visited.length, 5)} / 5`,
    },
    {
      id: "explorer",
      name: "Explorer",
      category: "Milestones",
      description: "Visit 10 destinations",
      icon: Sparkles,
      isUnlocked: visited.length >= 10,
      progressText: `${Math.min(visited.length, 10)} / 10`,
    },
    {
      id: "voyager",
      name: "Voyager",
      category: "Milestones",
      description: "Visit 25 destinations",
      icon: Flame,
      isUnlocked: visited.length >= 25,
      progressText: `${Math.min(visited.length, 25)} / 25`,
    },
    {
      id: "pref-novice",
      name: "Prefecture Novice",
      category: "Milestones",
      description: "Explore at least 3 prefectures",
      icon: MapPin,
      isUnlocked: visitedPrefectures.length >= 3,
      progressText: `${Math.min(visitedPrefectures.length, 3)} / 3`,
    },
    {
      id: "pref-wanderer",
      name: "Region Wanderer",
      category: "Milestones",
      description: "Explore 10 or more prefectures",
      icon: Mountain,
      isUnlocked: visitedPrefectures.length >= 10,
      progressText: `${Math.min(visitedPrefectures.length, 10)} / 10`,
    },
    {
      id: "pref-halfway",
      name: "Halfway Across Japan",
      category: "Milestones",
      description: "Explore 24 out of 47 prefectures",
      icon: Award,
      isUnlocked: visitedPrefectures.length >= 24,
      progressText: `${Math.min(visitedPrefectures.length, 24)} / 24`,
    },
    {
      id: "pref-master",
      name: "Japan Master",
      category: "Milestones",
      description: "Explore all 47 Japanese prefectures",
      icon: Crown,
      isUnlocked: visitedPrefectures.length >= 47,
      progressText: `${visitedPrefectures.length} / 47`,
    },
    // Region Badges
    {
      id: "reg-hokkaido",
      name: "Hokkaido Pioneer",
      category: "Regions",
      description: "Explore the northern wilderness of Hokkaido",
      icon: Award,
      isUnlocked: getRegionCount("Hokkaido") >= 1,
      progressText: `${getRegionCount("Hokkaido")} / 1`,
    },
    {
      id: "reg-tohoku",
      name: "Tohoku Explorer",
      category: "Regions",
      description: "Visit prefectures in northern Honshu (Tohoku)",
      icon: Award,
      isUnlocked: getRegionCount("Tohoku") >= 6,
      progressText: `${getRegionCount("Tohoku")} / 6`,
    },
    {
      id: "reg-kanto",
      name: "Kanto Adventurer",
      category: "Regions",
      description: "Explore Greater Tokyo & Kanto region prefectures",
      icon: Award,
      isUnlocked: getRegionCount("Kanto") >= 7,
      progressText: `${getRegionCount("Kanto")} / 7`,
    },
    {
      id: "reg-chubu",
      name: "Chubu Traveler",
      category: "Regions",
      description: "Explore central Japan & Japanese Alps (Chubu)",
      icon: Award,
      isUnlocked: getRegionCount("Chubu") >= 9,
      progressText: `${getRegionCount("Chubu")} / 9`,
    },
    {
      id: "reg-kansai",
      name: "Kansai Pilgrim",
      category: "Regions",
      description: "Explore historic Kyoto, Osaka & Kansai prefectures",
      icon: Award,
      isUnlocked: getRegionCount("Kansai") >= 7,
      progressText: `${getRegionCount("Kansai")} / 7`,
    },
    {
      id: "reg-chugoku",
      name: "Chugoku Discoverer",
      category: "Regions",
      description: "Explore western Honshu (Chugoku region)",
      icon: Award,
      isUnlocked: getRegionCount("Chugoku") >= 5,
      progressText: `${getRegionCount("Chugoku")} / 5`,
    },
    {
      id: "reg-shikoku",
      name: "Shikoku Wayfarer",
      category: "Regions",
      description: "Explore the 4 prefectures of Shikoku island",
      icon: Award,
      isUnlocked: getRegionCount("Shikoku") >= 4,
      progressText: `${getRegionCount("Shikoku")} / 4`,
    },
    {
      id: "reg-kyushu",
      name: "Kyushu & Okinawa Nomad",
      category: "Regions",
      description: "Explore southern tropical islands & Kyushu prefectures",
      icon: Award,
      isUnlocked: getRegionCount("Kyushu") >= 8,
      progressText: `${getRegionCount("Kyushu")} / 8`,
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-emerald-500" />
            Milestone & Exploration Badges
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Earn unlockable badges as you explore Japan's regions and log
            visited places
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
            Badges Earned
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {unlockedCount} / {badges.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.isUnlocked
                  ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/70 shadow-sm"
                  : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-65"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl shadow-sm ${
                    badge.isUnlocked
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {badge.isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {badge.name}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px] line-clamp-2">
                {badge.description}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">Progress</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {badge.progressText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
