import {
  Compass,
  Map,
  Clock,
  Trophy,
  FolderCheck,
  BarChart3,
} from "lucide-react";
import type { ComponentType } from "react";

export interface PassportSectionConfig {
  id:
    | "overview"
    | "japan-map"
    | "timeline"
    | "achievements"
    | "badges"
    | "statistics";
  label: string;
  shortLabel: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export const PASSPORT_SECTIONS: readonly PassportSectionConfig[] = [
  {
    id: "overview",
    label: "Overview",
    shortLabel: "🎯 Overview",
    description: "Summary overview of travel history & achievements",
    icon: Compass,
  },
  {
    id: "japan-map",
    label: "Japan Map",
    shortLabel: "🗾 Japan Map",
    description: "Interactive explored prefectures map & region breakdown",
    icon: Map,
  },
  {
    id: "timeline",
    label: "Timeline",
    shortLabel: "📜 Timeline",
    description: "Chronological travel activity feed",
    icon: Clock,
  },
  {
    id: "achievements",
    label: "Achievements",
    shortLabel: "🏆 Achievements",
    description: "Unlocked heritage list benchmarks & curated travel goals",
    icon: Trophy,
  },
  {
    id: "badges",
    label: "Badges",
    shortLabel: "🎖️ Badges",
    description: "Earned travel milestone & regional exploration badges",
    icon: FolderCheck,
  },
  {
    id: "statistics",
    label: "Statistics",
    shortLabel: "📊 Statistics",
    description: "Breakdown of explored places & prefecture stats",
    icon: BarChart3,
  },
] as const;
