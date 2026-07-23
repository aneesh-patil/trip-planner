import { describe, it, expect } from "vitest";
import { generateIcsContent } from "../CalendarService";
import type { Trip } from "@/shared/types/trip";

const mockTrip: Trip = {
  id: "trip-1",
  userId: "user-123",
  title: "Tokyo Autumn Adventure",
  startDate: "2026-11-01",
  endDate: "2026-11-05",
  status: "planned",
  stops: [
    {
      id: "stop-1",
      type: "destination",
      destinationId: "shinjuku",
      name: "Shinjuku Gyoen",
      arrivalTime: "10:00 AM",
    },
  ],
  createdAt: "2026-07-23T12:00:00Z",
  updatedAt: "2026-07-23T12:00:00Z",
};

describe("CalendarService Unit Tests", () => {
  it("generates a valid .ics VEVENT payload", () => {
    const ics = generateIcsContent(mockTrip);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Tokyo Autumn Adventure");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261101");
    expect(ics).toContain("DTEND;VALUE=DATE:20261105");
    expect(ics).toContain("DESCRIPTION:1. Shinjuku Gyoen (Arrives: 10:00 AM)");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });
});
