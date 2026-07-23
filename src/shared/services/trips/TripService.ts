import type { Trip, TripStop } from "@/shared/types/trip";

export function validateTrip(
  title: string,
  startDate?: string,
  endDate?: string,
): string[] {
  const errors: string[] = [];
  if (!title || title.trim() === "") {
    errors.push("Trip title is required.");
  }
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      errors.push("Start date cannot be after end date.");
    }
  }
  return errors;
}

export function addStopToTrip(trip: Trip, stop: Omit<TripStop, "id">): Trip {
  const newStop: TripStop = {
    ...stop,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  return {
    ...trip,
    stops: [...trip.stops, newStop],
    updatedAt: new Date().toISOString(),
  };
}

export function removeStopFromTrip(trip: Trip, stopId: string): Trip {
  return {
    ...trip,
    stops: trip.stops.filter((s) => s.id !== stopId),
    updatedAt: new Date().toISOString(),
  };
}

export function updateTripStop(
  trip: Trip,
  stopId: string,
  updates: Partial<TripStop>,
): Trip {
  return {
    ...trip,
    stops: trip.stops.map((s) => (s.id === stopId ? { ...s, ...updates } : s)),
    updatedAt: new Date().toISOString(),
  };
}

export function reorderStops(
  trip: Trip,
  startIndex: number,
  endIndex: number,
): Trip {
  if (
    startIndex < 0 ||
    startIndex >= trip.stops.length ||
    endIndex < 0 ||
    endIndex >= trip.stops.length
  ) {
    return trip;
  }
  const result = [...trip.stops];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return {
    ...trip,
    stops: result,
    updatedAt: new Date().toISOString(),
  };
}

export function duplicateTrip(
  trip: Trip,
): Omit<Trip, "id" | "createdAt" | "updatedAt"> {
  return {
    userId: trip.userId,
    title: `${trip.title} (Copy)`,
    startDate: trip.startDate,
    endDate: trip.endDate,
    status: trip.status,
    stops: trip.stops.map((stop) => ({
      ...stop,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    })),
    journalNotes: trip.journalNotes,
  };
}
