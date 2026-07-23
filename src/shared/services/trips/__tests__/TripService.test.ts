import { describe, it, expect } from "vitest";
import {
  validateTrip,
  addStopToTrip,
  removeStopFromTrip,
  reorderStops,
  duplicateTrip,
} from "../TripService";
import type { Trip } from "@/shared/types/trip";

const mockTrip: Trip = {
  id: "trip-1",
  userId: "user-123",
  title: "Weekend Trip",
  startDate: "2026-10-01",
  endDate: "2026-10-03",
  status: "draft",
  stops: [
    {
      id: "stop-1",
      type: "destination",
      destinationId: "hakone",
      name: "Hakone Onsen",
    },
    { id: "stop-2", type: "custom", name: "Hakone Hotel" },
  ],
  createdAt: "2026-07-23T12:00:00Z",
  updatedAt: "2026-07-23T12:00:00Z",
};

describe("TripService Unit Tests", () => {
  it("validates trip titles and date bounds", () => {
    expect(validateTrip("")).toContain("Trip title is required.");
    expect(validateTrip("Trip", "2026-10-05", "2026-10-01")).toContain(
      "Start date cannot be after end date.",
    );
    expect(validateTrip("Trip", "2026-10-01", "2026-10-03")).toEqual([]);
  });

  it("appends new stop to trip itinerary list", () => {
    const next = addStopToTrip(mockTrip, {
      type: "custom",
      name: "Lake Ashi Cruising",
      notes: "Catch the sunset",
    });
    expect(next.stops.length).toBe(3);
    expect(next.stops[2].name).toBe("Lake Ashi Cruising");
    expect(next.stops[2].id).toBeDefined();
  });

  it("removes a stop from trip itinerary", () => {
    const next = removeStopFromTrip(mockTrip, "stop-1");
    expect(next.stops.length).toBe(1);
    expect(next.stops[0].id).toBe("stop-2");
  });

  it("shifts stop orders correctly", () => {
    const next = reorderStops(mockTrip, 0, 1);
    expect(next.stops[0].id).toBe("stop-2");
    expect(next.stops[1].id).toBe("stop-1");
  });

  it("duplicates trip items mapping new stop IDs", () => {
    const dup = duplicateTrip(mockTrip);
    expect(dup.title).toBe("Weekend Trip (Copy)");
    expect(dup.stops.length).toBe(2);
    expect(dup.stops[0].id).not.toBe("stop-1");
  });
});
