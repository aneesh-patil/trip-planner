import { describe, it, expect } from "vitest";
import { tokenizeQuery, matchesDestination } from "../DestinationSearch";
import type { Destination } from "@/shared/types/destination";

const baseDest = {
  id: "test",
  name: "Hakone Onsen Resort",
  prefecture: "Kanagawa",
  region: "Kanto",
  description: "Famous hot springs near Mount Fuji view spots",
  categories: ["Onsen", "Resort"],
  tags: ["Onsen", "Fuji-view"],
  heroImage: "",
  gallery: [],
  highlights: ["Lake Ashi"],
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
} as unknown as Destination;

describe("DestinationSearch Unit Tests", () => {
  it("tokenizes search query by whitespace and lowercases", () => {
    expect(tokenizeQuery("Hakone Onsen  Fuji")).toEqual([
      "hakone",
      "onsen",
      "fuji",
    ]);
    expect(tokenizeQuery("   ")).toEqual([]);
  });

  it("matches destinations against all query tokens", () => {
    const tokensMatch = ["hakone", "fuji"];
    expect(matchesDestination(baseDest, tokensMatch)).toBe(true);

    const tokensMismatch = ["hakone", "kyoto"];
    expect(matchesDestination(baseDest, tokensMismatch)).toBe(false);
  });
});
