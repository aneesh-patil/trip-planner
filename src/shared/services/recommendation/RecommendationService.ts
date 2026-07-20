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
    .filter((dest) => dest.id && !visitedIds.includes(dest.id))
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

      let score = 20 + (dest.ratings?.overall || 5) * 6;
      const reasons: string[] = [];

      // 1. Budget Logic
      if (dest.budgetRecommended) {
        const adjustedBudget = getAdjustedBudget(
          dest as Destination,
          transport,
        );
        if (adjustedBudget > budget) {
          score -= ((adjustedBudget - budget) / 1000) * 1.5;
        } else {
          score += Math.min(8, (budget - adjustedBudget) / 3000);
          if (budget - adjustedBudget >= 5000)
            reasons.push(
              `Well under budget (est. ¥${adjustedBudget.toLocaleString()})`,
            );
        }
      }

      // 2. Transport Logic
      if (transport === "train") {
        if (!dest.transportOptions?.train) {
          score -= 1000;
        } else {
          const time = dest.transportOptions.train;
          score += 4 + Math.max(0, 12 - time / 10);
          if (time <= 60) reasons.push(`Fast train access (${time}m)`);
        }
      } else if (transport === "car") {
        if (!dest.transportOptions?.car) score -= 1000;
        if (dest.transportOptions?.car) {
          const time = dest.transportOptions.car;
          score += 5 + Math.max(0, 10 - time / 15);
          if (time <= 60) reasons.push(`Easy drive (${time}m)`);
        }
      } else if (transport === "shinkansen") {
        if (!dest.transportOptions?.shinkansen) {
          score -= 1000;
        } else {
          score += 10;
          reasons.push(
            `Accessible by Shinkansen (${dest.transportOptions.shinkansen}m)`,
          );
        }
      } else if (transport === "bus") {
        if (!dest.transportOptions?.bus) {
          score -= 1000;
        } else {
          score += 10;
          reasons.push(
            `Accessible by Highway Bus (${dest.transportOptions.bus}m)`,
          );
        }
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
          score += (ratings.food - 5) * 4.5;
          if (ratings.food >= 8.5) reasons.push("Top-tier local food scene");
          break;
        case "nature":
          if (tags.includes("Nature") || cats.includes("Mountain")) {
            score += 12 + ratings.photography * 1.5;
            reasons.push("Beautiful nature escape");
          } else score -= 25;
          break;
        case "history":
          if (
            cats.includes("History") ||
            cats.includes("Shrine") ||
            tags.includes("Historic")
          ) {
            score += 18;
            reasons.push("Deep historical significance");
          } else score -= 20;
          break;
        case "art":
          if (cats.includes("Museum") || cats.includes("Art")) {
            score += 18;
            reasons.push("Rich in museums & art");
          } else score -= 20;
          break;
        case "sea":
          if (
            cats.includes("Coast") ||
            cats.includes("Sea") ||
            cats.includes("Beach")
          ) {
            score += 18;
            reasons.push("Gorgeous coastal atmosphere");
          } else score -= 35;
          break;
        case "cool":
          score += (ratings.summer - 5) * 4.5;
          if (ratings.summer >= 8.5) reasons.push("Cool & refreshing climate");
          break;
        case "themepark":
          if (cats.includes("Theme Park")) {
            score += 30;
            reasons.push("World-class theme park");
          } else score -= 45;
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
        score += (indoor / 100) * 25;
        if (indoor >= 70)
          reasons.push(`${Math.round(indoor)}% indoor (perfect for rain)`);
        if (indoor < 30) score -= 30;
      }
      if (isHot) {
        score += (ratings.summer - 5) * 4;
        if (ratings.summer >= 8.5) reasons.push("Cool retreat from heat");
        if (ratings.summer <= 4) score -= 20;
      }
      if (isCold) {
        score += (ratings.winter - 5) * 4;
        if (ratings.winter >= 8.5) reasons.push("Warm indoor/winter escape");
        if (ratings.winter <= 4) score -= 20;
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

// Object alias kept for backwards compatibility with existing import sites
export const recommendationService = { getRecommendations };
