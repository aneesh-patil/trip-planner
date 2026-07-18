import { describe, it, expect } from "vitest";
import {
  recommendationService,
  type RecommendationContext,
} from "./RecommendationService";
import type { Destination } from "@/shared/types/destination";

describe("RecommendationService", () => {
  const mockDestinations: Partial<Destination>[] = [
    {
      id: "dest1",
      name: "History Place",
      categories: ["History"],
      tags: ["Historic"],
      ratings: {
        overall: 9,
        photography: 8,
        food: 7,
        summer: 7,
        winter: 7,
        couple: 8,
        uniqueness: 9,
        value: 8,
        rain: 8,
        relaxation: 8,
      },
      budgetRecommended: 15000,
      indoorPercent: 20,
      transportOptions: { train: 45 },
    },
    {
      id: "dest2",
      name: "Indoor Museum",
      categories: ["Museum", "Art"],
      tags: [],
      ratings: {
        overall: 8,
        photography: 6,
        food: 6,
        summer: 9,
        winter: 9,
        couple: 7,
        uniqueness: 7,
        value: 7,
        rain: 8,
        relaxation: 8,
      },
      budgetRecommended: 12000,
      indoorPercent: 95,
      transportOptions: { train: 30 },
    },
    {
      id: "dest3",
      name: "Far Away Nature",
      categories: ["Nature", "Mountain"],
      tags: ["Scenic"],
      ratings: {
        overall: 9,
        photography: 10,
        food: 5,
        summer: 8,
        winter: 4,
        couple: 9,
        uniqueness: 8,
        value: 8,
        rain: 8,
        relaxation: 8,
      },
      budgetRecommended: 25000,
      indoorPercent: 5,
      transportOptions: { car: 120 },
    },
  ];

  it("filters out visited destinations", () => {
    const context: RecommendationContext = {
      tripType: "any",
      budget: 30000,
      transport: "any",
      weather: "any",
      visitedIds: ["dest1"],
    };
    const recommendations = recommendationService.getRecommendations(
      mockDestinations,
      context,
    );
    expect(recommendations).toHaveLength(2);
    expect(recommendations.find((r) => r.id === "dest1")).toBeUndefined();
  });

  it("boosts indoor locations when it rains", () => {
    const context: RecommendationContext = {
      tripType: "any",
      budget: 30000,
      transport: "any",
      weather: "rainy",
      visitedIds: [],
    };
    const recommendations = recommendationService.getRecommendations(
      mockDestinations,
      context,
    );
    // Museum (dest2) should be #1 because it has 95% indoor
    expect(recommendations[0].id).toBe("dest2");
    expect(recommendations[0].matchReasons).toContain(
      "95% indoor (perfect for rain)",
    );
  });

  it("boosts history locations for history trip type", () => {
    const context: RecommendationContext = {
      tripType: "history",
      budget: 30000,
      transport: "any",
      weather: "any",
      visitedIds: [],
    };
    const recommendations = recommendationService.getRecommendations(
      mockDestinations,
      context,
    );
    expect(recommendations[0].id).toBe("dest1");
    expect(recommendations[0].matchReasons).toContain(
      "Deep historical significance",
    );
  });

  it("penalizes locations that do not match the required transport mode", () => {
    const context: RecommendationContext = {
      tripType: "any",
      budget: 30000,
      transport: "car",
      weather: "any",
      visitedIds: [],
    };
    const recommendations = recommendationService.getRecommendations(
      mockDestinations,
      context,
    );
    // Only dest3 has 'car', so it should have a high score, while dest1 and dest2 drop severely
    expect(recommendations[0].id).toBe("dest3");
  });
});
