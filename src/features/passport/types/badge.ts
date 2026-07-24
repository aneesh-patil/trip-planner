export type BadgeCategory =
  "travel-style" | "interests" | "regional" | "experience";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export type BadgeIllustrationId = string;

export interface UnlockRule {
  type:
    | "visit_count"
    | "prefecture_count"
    | "category_count"
    | "tag_count"
    | "transit_mode"
    | "seasonal";
  target: number;
  targetValue?: string;
}

export interface Badge {
  id: string;
  name: string;
  category: BadgeCategory;
  categoryLabel: string;
  rarity: BadgeRarity;
  description: string;
  howToEarn: string;
  illustrationId: BadgeIllustrationId;
  unlockRule: UnlockRule;
  introducedIn?: string;
}

export type AchievementTrigger =
  | { type: "collection_complete"; collectionId: string }
  | { type: "prefecture_count"; threshold: number }
  | { type: "visit_count"; threshold: number }
  | { type: "all_regions" }
  | { type: "four_seasons" }
  | { type: "custom"; ruleId: string };

export interface Achievement {
  id: string;
  title: string;
  description: string;
  trigger: AchievementTrigger;
  badgeRewardId?: string;
  iconName: string;
  category: string;
}

export interface BadgeContext {
  visited: string[];
  visitedPrefectures: string[];
  visitedDates: Record<string, string[] | string>;
  tripsCount: number;
  completedCollectionIds: string[];
}
