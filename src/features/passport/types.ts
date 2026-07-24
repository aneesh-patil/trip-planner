import { PASSPORT_SECTIONS } from "./constants";

export type PassportTab = (typeof PASSPORT_SECTIONS)[number]["id"];

export interface PassportStats {
  visitedCount: number;
  totalPrefectures: number;
  completedAchievementsCount: number;
  totalAchievementsCount: number;
}
