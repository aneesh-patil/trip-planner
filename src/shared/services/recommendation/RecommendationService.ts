import type { Destination } from "@/shared/types/destination";
import { budgetService } from "@/shared/services/budget/BudgetService";

export interface RecommendationContext {
  tripType: string;
  budget: number;
  transport: string;
  weather: string;
  visitedIds: string[];
  currentWeather?: {
    temp: number;
    desc: string;
  } | null;
}

export interface ScoredDestination extends Partial<Destination> {
  matchScore: number;
  matchReasons: string[];
}

export class RecommendationService {
  public getRecommendations(
    destinations: Partial<Destination>[],
    context: RecommendationContext,
  ): ScoredDestination[] {
    const { tripType, budget, transport, weather, visitedIds, currentWeather } =
      context;

    return destinations
      .filter((dest) => dest.id && !visitedIds.includes(dest.id))
      .map((dest) => {
        // Base score derived from overall rating
        let score = 20 + (dest.ratings?.overall || 5) * 6;
        const reasons: string[] = [];

        // 2. Budget Logic
        if (dest.budgetRecommended) {
          // Cast dest to Destination just for budget check
          const adjustedBudget = budgetService.getAdjustedBudget(
            dest as Destination,
            transport,
          );
          if (adjustedBudget > budget) {
            score -= ((adjustedBudget - budget) / 1000) * 1.5;
          } else {
            const budgetBonus = Math.min(8, (budget - adjustedBudget) / 3000);
            score += budgetBonus;
            if (budget - adjustedBudget >= 5000) {
              reasons.push(
                `Well under budget (est. ¥${adjustedBudget.toLocaleString()})`,
              );
            }
          }
        }

        // 3. Transport Logic
        if (transport === "train") {
          if (!dest.transportOptions?.train) {
            score -= 1000;
          } else {
            const time = dest.transportOptions.train;
            const timeBonus = Math.max(0, 12 - time / 10);
            score += 4 + timeBonus;
            if (time <= 60) reasons.push(`Fast train access (${time}m)`);
          }
        } else if (transport === "car") {
          if (!dest.transportOptions?.car) score -= 1000;
          if (dest.transportOptions?.car) {
            const time = dest.transportOptions.car;
            const timeBonus = Math.max(0, 10 - time / 15);
            score += 5 + timeBonus;
            if (time <= 60) reasons.push(`Easy drive (${time}m)`);
          }
        } else if (transport === "shinkansen") {
          if (!dest.transportOptions?.shinkansen) {
            score -= 1000;
          } else {
            const time = dest.transportOptions.shinkansen;
            score += 10;
            reasons.push(`Accessible by Shinkansen (${time}m)`);
          }
        } else if (transport === "bus") {
          if (!dest.transportOptions?.bus) {
            score -= 1000;
          } else {
            const time = dest.transportOptions.bus;
            score += 10;
            reasons.push(`Accessible by Highway Bus (${time}m)`);
          }
        }

        // 4. Trip Type Logic
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
            if (ratings.summer >= 8.5)
              reasons.push("Cool & refreshing climate");
            break;
          case "themepark":
            if (cats.includes("Theme Park")) {
              score += 30;
              reasons.push("World-class theme park");
            } else score -= 45;
            break;
        }

        // 5. Environmental Logic
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
          const indoorBonus = (indoor / 100) * 25;
          score += indoorBonus;
          if (indoor >= 70)
            reasons.push(`${Math.round(indoor)}% indoor (perfect for rain)`);
          if (indoor < 30) score -= 30;
        }

        if (isHot) {
          score += (ratings.summer - 5) * 4;
          if (ratings.summer >= 8.5) reasons.push(`Cool retreat from heat`);
          if (ratings.summer <= 4) score -= 20;
        }

        if (isCold) {
          score += (ratings.winter - 5) * 4;
          if (ratings.winter >= 8.5) reasons.push(`Warm indoor/winter escape`);
          if (ratings.winter <= 4) score -= 20;
        }

        if (reasons.length === 0) {
          if (ratings.overall >= 8.5)
            reasons.push("Highly rated all-around choice");
          else reasons.push("Solid match for your criteria");
        }

        const finalScore = Math.min(99.9, Math.max(0.1, score));

        return {
          ...dest,
          matchScore: finalScore,
          matchReasons: reasons.slice(0, 3),
        };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}

export const recommendationService = new RecommendationService();
