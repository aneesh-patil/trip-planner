import { describe, it, expect } from "vitest";
import {
  isCoupleFriendly,
  isFamilyFriendly,
  isSoloFriendly,
  isAccessible,
} from "../RecommendationFilters";
import type { Destination } from "@/shared/types/destination";

const baseDest = {
  id: "test",
  name: "Test",
  prefecture: "Tokyo",
  region: "Kanto",
  description: "",
  categories: [],
  tags: [],
  heroImage: "",
  gallery: [],
  highlights: [],
  budgetMin: 0,
  budgetRecommended: 0,
  budgetMax: 0,
  ratings: {
    overall: 8.5,
    couple: 8.0,
    relaxation: 8.0,
    food: 5,
    value: 5,
    summer: 5,
    winter: 5,
    rain: 5,
    photography: 5,
    uniqueness: 5,
  },
  bestSeason: "Spring",
  coordinates: { lat: 0, lng: 0 },
  transportOptions: {},
  totalTripHours: 0,
  walkingMin: 0,
  walkingSunMin: 0,
  walkingShadeMin: 0,
  indoorPercent: 50,
  crowd: { weekday: 1, weekend: 2, holiday: 3 },
  season: { spring: 5, summer: 5, autumn: 5, winter: 5 },
  comfort: { walkingIntensity: 3, heatTolerance: 3, rainFriendly: 3 },
} as unknown as Destination;

describe("RecommendationFilters Unit Tests", () => {
  it("determines couple friendly based on threshold", () => {
    expect(isCoupleFriendly(baseDest)).toBe(true);
    const poorCouple = {
      ...baseDest,
      ratings: { ...baseDest.ratings, couple: 5 },
    };
    expect(isCoupleFriendly(poorCouple)).toBe(false);
  });

  it("determines family friendly based on relaxation and walkingIntensity", () => {
    expect(isFamilyFriendly(baseDest)).toBe(true);
    const intenseWalk = {
      ...baseDest,
      comfort: { ...baseDest.comfort, walkingIntensity: 9 },
    };
    expect(isFamilyFriendly(intenseWalk as unknown as Destination)).toBe(false);
  });

  it("determines solo friendly based on overall threshold", () => {
    expect(isSoloFriendly(baseDest)).toBe(true);
  });

  it("determines accessibility based on walkingIntensity", () => {
    expect(isAccessible(baseDest)).toBe(true);
    const hardWalk = {
      ...baseDest,
      comfort: { ...baseDest.comfort, walkingIntensity: 7 },
    };
    expect(isAccessible(hardWalk as unknown as Destination)).toBe(false);
  });
});
