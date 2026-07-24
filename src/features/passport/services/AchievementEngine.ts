import { ACHIEVEMENTS_CATALOG } from "../data/achievements";
import type { Achievement, BadgeContext } from "../types/badge";

export class AchievementEngine {
  static isUnlocked(achievement: Achievement, ctx: BadgeContext): boolean {
    const trigger = achievement.trigger;

    switch (trigger.type) {
      case "visit_count":
        return ctx.visited.length >= trigger.threshold;

      case "prefecture_count":
        return ctx.visitedPrefectures.length >= trigger.threshold;

      case "collection_complete":
        return ctx.completedCollectionIds.includes(trigger.collectionId);

      case "all_regions":
        return ctx.visitedPrefectures.length >= 47;

      case "four_seasons":
        return ctx.visited.length >= 4;

      case "custom":
        return ctx.visited.length >= 1;

      default:
        return false;
    }
  }

  static evaluateAll(
    ctx: BadgeContext,
  ): Record<string, { isUnlocked: boolean; earnedAt?: string }> {
    const results: Record<string, { isUnlocked: boolean; earnedAt?: string }> =
      {};

    for (const ach of ACHIEVEMENTS_CATALOG) {
      const unlocked = this.isUnlocked(ach, ctx);
      results[ach.id] = {
        isUnlocked: unlocked,
        earnedAt: unlocked ? "July 2026" : undefined,
      };
    }

    return results;
  }
}
