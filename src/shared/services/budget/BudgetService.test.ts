import { describe, it, expect } from "vitest";
import { budgetService } from "./BudgetService";
import type { Destination } from "@/shared/types/destination";

describe("BudgetService", () => {
  const mockDest = {
    id: "test",
    name: "Test Dest",
    prefecture: "Tokyo",
    region: "Kanto",
    categories: [],
    tags: [],
    heroImage: "",
    description: "",
    highlights: [],
    restaurants: [],
    cafes: [],
    reservation: "",
    parking: "",
    budgetRecommended: 20000,
    budgetMin: 15000,
    budgetMax: 25000,
    totalTripHours: 8,
    walkingMin: 30,
    indoorPercent: 50,
    ratings: {
      overall: 8,
      photography: 8,
      food: 8,
      summer: 8,
      winter: 8,
      couple: 8,
      uniqueness: 8,
      value: 8,
      rain: 8,
      relaxation: 8,
    },
    transportOptions: {
      train: 60,
      car: 50,
      shinkansen: 30,
    },
    budgetBreakdown: {
      transport: 2000,
      food: 5000,
      cafe: 1000,
      tickets: 2000,
    },
  } as unknown as Destination;

  it("calculates transport cost correctly for couple multiplier (train)", () => {
    // Train (60 min local/rapid):
    // oneWayPerPerson = 150 + 60 * 25 = 1650.
    // roundTripPerPerson = 3300.
    // Party size (couple) = 2. Total = 6600.
    const cost = budgetService.getTransportCost(mockDest, "train");
    expect(cost).toBe(6600);
  });

  it("calculates transport cost correctly for car rental, gas, and tolls", () => {
    // Car drive time: 50 min.
    // Distance = 50 * 1.2 = 60 km.
    // Trip hours = 8. Base fee up to 12h = 7920.
    // Tolls round trip = Math.floor(60 * 30 * 2) = 3600.
    // Gas round trip = Math.floor((120 / 13) * 175) = 1615.
    // Total = 7920 + 3600 + 1615 = 13135.
    const cost = budgetService.getTransportCost(mockDest, "car");
    expect(cost).toBe(13135);
  });

  it("calculates adjusted budget subtracting original transport cost and adding new transport", () => {
    // Original recommended = 20000.
    // Original transport = 2000.
    // Base other costs = 18000.
    // Train cost for couple = 6600.
    // Expected = 18000 + 6600 = 24600.
    const budget = budgetService.getAdjustedBudget(mockDest, "train");
    expect(budget).toBe(24600);
  });
});
