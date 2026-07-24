import {
  Compass,
  Map,
  Calendar,
  Clock,
  FolderCheck,
  Trophy,
  BarChart3,
} from "lucide-react";
import type { ComponentType } from "react";

export interface PassportSectionConfig {
  id:
    | "overview"
    | "japan-map"
    | "calendar"
    | "timeline"
    | "collections"
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
    id: "calendar",
    label: "Travel Calendar",
    shortLabel: "📅 Travel Calendar",
    description: "Activity log grouped by year and month",
    icon: Calendar,
  },
  {
    id: "timeline",
    label: "Timeline",
    shortLabel: "📜 Timeline",
    description: "Chronological travel activity feed",
    icon: Clock,
  },
  {
    id: "collections",
    label: "Collections Progress",
    shortLabel: "📁 Collections",
    description: "Unlocked collections & regional completion metrics",
    icon: FolderCheck,
  },
  {
    id: "badges",
    label: "Badges & Achievements",
    shortLabel: "🏆 Badges",
    description: "Unlocked travel milestones & heritage badges",
    icon: Trophy,
  },
  {
    id: "statistics",
    label: "Statistics",
    shortLabel: "📊 Statistics",
    description: "Breakdown of explored places & prefecture stats",
    icon: BarChart3,
  },
] as const;
