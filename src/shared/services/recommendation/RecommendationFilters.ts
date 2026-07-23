import type { Destination } from "@/shared/types/destination";

export const SUITABILITY_THRESHOLD = 8;

export function isCoupleFriendly(destination: Destination): boolean {
  return (destination.ratings?.couple ?? 0) >= SUITABILITY_THRESHOLD;
}

export function isFamilyFriendly(destination: Destination): boolean {
  // Family friendly if relaxation rating is high and walking intensity is not extreme
  const relaxation = destination.ratings?.relaxation ?? 0;
  const walkingIntensity = destination.comfort?.walkingIntensity ?? 5;
  return relaxation >= 7.5 && walkingIntensity <= 7;
}

export function isSoloFriendly(destination: Destination): boolean {
  // Solo friendly if overall popularity or uniqueness is good
  return (destination.ratings?.overall ?? 0) >= SUITABILITY_THRESHOLD;
}

export function isAccessible(destination: Destination): boolean {
  // Accessible if walking intensity is low
  const walkingIntensity = destination.comfort?.walkingIntensity ?? 5;
  return walkingIntensity <= 5;
}
