import type { Destination } from "@/shared/types/destination";
import { getAdjustedBudget } from "@/shared/services/budget/BudgetService";
import {
  getDistance,
  getDynamicTransportOptions,
} from "@/shared/utils/distance";

export interface RecommendationContext {
  tripType: string;
  budget: number;
  transport: string;
  weather: string;
  visitedIds: string[];
  currentWeather?: { temp: number; desc: string } | null;
  homeStationCoords?: { lat: number; lng: number } | null;
}

export interface ScoredDestination extends Partial<Destination> {
  matchScore: number;
  matchReasons: string[];
}

export const SCORING_WEIGHTS = {
  // Base & Ratings
  BASE_SCORE: 20,
  RATING_MULTIPLIER: 6,

  // Budget
  BUDGET_OVER_PENALTY_MULTIPLIER: 1.5,
  BUDGET_OVER_DIVISOR: 1000,
  BUDGET_UNDER_BONUS_MAX: 10,
  BUDGET_UNDER_DIVISOR: 3000,

  // Transport
  TRANSPORT_TRAIN_BASE: 4,
  TRANSPORT_CAR_BASE: 5,
  TRANSPORT_SHINKANSEN_FLAT: 12,
  TRANSPORT_BUS_FLAT: 10,

  // Trip Type (Target ~+20 for strong match, -25 for mismatch)
  TRIP_TYPE_FOOD_MULTIPLIER: 5, // e.g. (10 - 5) * 5 = +25 max
  TRIP_TYPE_NATURE_MATCH: 15,
  TRIP_TYPE_NATURE_PHOTO_MULT: 1, // 15 + (10 * 1) = +25 max
  TRIP_TYPE_NATURE_PENALTY: 25,
  TRIP_TYPE_HISTORY_MATCH: 20,
  TRIP_TYPE_HISTORY_PENALTY: 25,
  TRIP_TYPE_ART_MATCH: 20,
  TRIP_TYPE_ART_PENALTY: 25,
  TRIP_TYPE_SEA_MATCH: 20,
  TRIP_TYPE_SEA_PENALTY: 25,
  TRIP_TYPE_COOL_MULTIPLIER: 5, // e.g. (10 - 5) * 5 = +25 max
  TRIP_TYPE_THEMEPARK_MATCH: 20,
  TRIP_TYPE_THEMEPARK_PENALTY: 25,

  // Environment
  ENV_RAIN_INDOOR_MULTIPLIER: 25,
  ENV_RAIN_POOR_INDOOR_PENALTY: 25,
  ENV_TEMP_MULTIPLIER: 5,
  ENV_TEMP_PENALTY: 25,
};

export function getRecommendations(
  destinations: Partial<Destination>[],
  context: RecommendationContext,
): ScoredDestination[] {
  const {
    tripType,
    budget,
    transport,
    weather,
    visitedIds,
    currentWeather,
    homeStationCoords,
  } = context;

  return destinations
    .filter((destObj) => {
      if (!destObj.id || visitedIds.includes(destObj.id)) return false;

      // Hard filter: discard destinations missing the explicitly requested transport mode
      if (transport === "train" && !destObj.transportOptions?.train)
        return false;
      if (
        (transport === "car" || transport === "my_car") &&
        !destObj.transportOptions?.car &&
        !destObj.transportOptions?.my_car
      )
        return false;
      if (transport === "shinkansen" && !destObj.transportOptions?.shinkansen)
        return false;
      if (transport === "bus" && !destObj.transportOptions?.bus) return false;

      return true;
    })
    .map((destObj) => {
      // Clone destination to safely override transportOptions
      const dest = { ...destObj };
      if (homeStationCoords && dest.coordinates?.lat && dest.coordinates?.lng) {
        const distKm = getDistance(
          homeStationCoords.lat,
          homeStationCoords.lng,
          dest.coordinates.lat,
          dest.coordinates.lng,
        );
        const hasShinkansen = Boolean(destObj.transportOptions?.shinkansen);
        dest.transportOptions = getDynamicTransportOptions(
          distKm,
          hasShinkansen,
        );
      }

      let score =
        SCORING_WEIGHTS.BASE_SCORE +
        (dest.ratings?.overall || 5) * SCORING_WEIGHTS.RATING_MULTIPLIER;
      const reasons: string[] = [];

      // 1. Budget Logic
      if (dest.budgetRecommended) {
        const adjustedBudget = getAdjustedBudget(
          dest as Destination,
          transport,
        );
        if (adjustedBudget > budget) {
          score -=
            ((adjustedBudget - budget) / SCORING_WEIGHTS.BUDGET_OVER_DIVISOR) *
            SCORING_WEIGHTS.BUDGET_OVER_PENALTY_MULTIPLIER;
        } else {
          score += Math.min(
            SCORING_WEIGHTS.BUDGET_UNDER_BONUS_MAX,
            (budget - adjustedBudget) / SCORING_WEIGHTS.BUDGET_UNDER_DIVISOR,
          );
          if (budget - adjustedBudget >= 5000)
            reasons.push(
              `Well under budget (est. ¥${adjustedBudget.toLocaleString()})`,
            );
        }
      }

      // 2. Transport Logic (Hard filters already removed impossible routes)
      if (transport === "train") {
        const time = dest.transportOptions?.train;
        if (time) {
          score +=
            SCORING_WEIGHTS.TRANSPORT_TRAIN_BASE + Math.max(0, 12 - time / 10);
          if (time <= 60) reasons.push(`Fast train access (${time}m)`);
        }
      } else if (transport === "car" || transport === "my_car") {
        const time =
          transport === "my_car"
            ? dest.transportOptions?.my_car
            : dest.transportOptions?.car;
        if (time) {
          score +=
            SCORING_WEIGHTS.TRANSPORT_CAR_BASE + Math.max(0, 10 - time / 15);
          if (time <= 60) reasons.push(`Easy drive (${time}m)`);
        }
      } else if (transport === "shinkansen") {
        score += SCORING_WEIGHTS.TRANSPORT_SHINKANSEN_FLAT;
        reasons.push(
          `Accessible by Shinkansen (${dest.transportOptions?.shinkansen}m)`,
        );
      } else if (transport === "bus") {
        score += SCORING_WEIGHTS.TRANSPORT_BUS_FLAT;
        reasons.push(
          `Accessible by Highway Bus (${dest.transportOptions?.bus}m)`,
        );
      }

      // 3. Trip Type Logic
      const ratings = dest.ratings || {
        food: 5,
        photography: 5,
        summer: 5,
        winter: 5,
        overall: 5,
      };
      const cats = dest.categories || [];
      const tags = dest.tags || [];

      switch (tripType) {
        case "food":
          score +=
            (ratings.food - 5) * SCORING_WEIGHTS.TRIP_TYPE_FOOD_MULTIPLIER;
          if (ratings.food >= 8.5) reasons.push("Top-tier local food scene");
          break;
        case "nature":
          if (tags.includes("Nature") || cats.includes("Mountain")) {
            score +=
              SCORING_WEIGHTS.TRIP_TYPE_NATURE_MATCH +
              ratings.photography * SCORING_WEIGHTS.TRIP_TYPE_NATURE_PHOTO_MULT;
            reasons.push("Beautiful nature escape");
          } else score -= SCORING_WEIGHTS.TRIP_TYPE_NATURE_PENALTY;
          break;
        case "history":
          if (
            cats.includes("History") ||
            cats.includes("Shrine") ||
            tags.includes("Historic")
          ) {
            score += SCORING_WEIGHTS.TRIP_TYPE_HISTORY_MATCH;
            reasons.push("Deep historical significance");
          } else score -= SCORING_WEIGHTS.TRIP_TYPE_HISTORY_PENALTY;
          break;
        case "art":
          if (cats.includes("Museum") || cats.includes("Art")) {
            score += SCORING_WEIGHTS.TRIP_TYPE_ART_MATCH;
            reasons.push("Rich in museums & art");
          } else score -= SCORING_WEIGHTS.TRIP_TYPE_ART_PENALTY;
          break;
        case "sea":
          if (
            cats.includes("Coast") ||
            cats.includes("Sea") ||
            cats.includes("Beach")
          ) {
            score += SCORING_WEIGHTS.TRIP_TYPE_SEA_MATCH;
            reasons.push("Gorgeous coastal atmosphere");
          } else score -= SCORING_WEIGHTS.TRIP_TYPE_SEA_PENALTY;
          break;
        case "cool":
          score +=
            (ratings.summer - 5) * SCORING_WEIGHTS.TRIP_TYPE_COOL_MULTIPLIER;
          if (ratings.summer >= 8.5) reasons.push("Cool & refreshing climate");
          break;
        case "themepark":
          if (cats.includes("Theme Park")) {
            score += SCORING_WEIGHTS.TRIP_TYPE_THEMEPARK_MATCH;
            reasons.push("World-class theme park");
          } else score -= SCORING_WEIGHTS.TRIP_TYPE_THEMEPARK_PENALTY;
          break;
      }

      // 4. Environmental Logic
      const isRaining =
        (currentWeather &&
          (currentWeather.desc === "Rainy" ||
            currentWeather.desc === "Stormy")) ||
        weather === "rainy";
      const isHot =
        (currentWeather && currentWeather.temp >= 30) || weather === "summer";
      const isCold =
        (currentWeather && currentWeather.temp <= 10) || weather === "winter";

      if (isRaining) {
        const indoor = dest.indoorPercent || 0;
        score += (indoor / 100) * SCORING_WEIGHTS.ENV_RAIN_INDOOR_MULTIPLIER;
        if (indoor >= 70)
          reasons.push(`${Math.round(indoor)}% indoor (perfect for rain)`);
        if (indoor < 30) score -= SCORING_WEIGHTS.ENV_RAIN_POOR_INDOOR_PENALTY;
      }
      if (isHot) {
        score += (ratings.summer - 5) * SCORING_WEIGHTS.ENV_TEMP_MULTIPLIER;
        if (ratings.summer >= 8.5) reasons.push("Cool retreat from heat");
        if (ratings.summer <= 4) score -= SCORING_WEIGHTS.ENV_TEMP_PENALTY;
      }
      if (isCold) {
        score += (ratings.winter - 5) * SCORING_WEIGHTS.ENV_TEMP_MULTIPLIER;
        if (ratings.winter >= 8.5) reasons.push("Warm indoor/winter escape");
        if (ratings.winter <= 4) score -= SCORING_WEIGHTS.ENV_TEMP_PENALTY;
      }

      if (reasons.length === 0) {
        reasons.push(
          ratings.overall >= 8.5
            ? "Highly rated all-around choice"
            : "Solid match for your criteria",
        );
      }

      return {
        ...dest,
        matchScore: Math.min(99.9, Math.max(0.1, score)),
        matchReasons: reasons.slice(0, 3),
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
