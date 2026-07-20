import type { Destination } from "@/shared/types/destination";

const PARTY_SIZE = 2; // couple
const CAR_RENTAL_RATES = {
  upTo6h: 7370,
  upTo12h: 7920,
  upTo24h: 10340,
  extraPerHour: 1540,
} as const;
const GAS_PRICE_PER_LITER = 170;
const TOLL_RATE_PER_KM = 25;

function getRentalBaseFee(tripDurationHours: number): number {
  if (tripDurationHours <= 6) return CAR_RENTAL_RATES.upTo6h;
  if (tripDurationHours <= 12) return CAR_RENTAL_RATES.upTo12h;
  if (tripDurationHours <= 24) return CAR_RENTAL_RATES.upTo24h;
  return (
    CAR_RENTAL_RATES.upTo24h +
    Math.ceil(tripDurationHours - 24) * CAR_RENTAL_RATES.extraPerHour
  );
}

/**
 * Returns the round-trip transport cost for a couple.
 * This is the single source of truth — do not duplicate this in utils.ts.
 */
export function getTransportCost(dest: Destination, mode: string): number {
  if (mode === "shinkansen" && dest.transportOptions?.shinkansen) {
    const time = dest.transportOptions.shinkansen;
    // Calibrated against real JR fares from Yokohama area:
    // round-trip per person ≈ 1000 + 136 × one-way minutes
    // Atami 45min: ¥7,120/person ✓  Shizuoka 60min: ¥9,160 (real ¥9,640, -5%)
    return Math.floor(1000 + time * 136) * PARTY_SIZE;
  }

  if (mode === "bus" && dest.transportOptions?.bus) {
    const time = dest.transportOptions.bus;
    return Math.floor(2000 + time * 15) * PARTY_SIZE;
  }

  if (mode === "car" && dest.transportOptions?.car) {
    const driveTimeOneWayMin = dest.transportOptions.car;
    const distanceKm = driveTimeOneWayMin * 1.2;
    const tripDurationHours = dest.totalTripHours || 8;
    const rentalFee = getRentalBaseFee(tripDurationHours);
    const tollsRoundTrip = Math.floor(distanceKm * TOLL_RATE_PER_KM * 2);
    const gasRoundTrip = Math.floor(
      ((distanceKm * 2) / 15) * GAS_PRICE_PER_LITER,
    );
    return rentalFee + tollsRoundTrip + gasRoundTrip;
  }

  if (mode === "train" && dest.transportOptions?.train) {
    const time = dest.transportOptions.train;
    return Math.max(600, Math.floor(time * 34.3)) * PARTY_SIZE;
  }

  return dest.budgetBreakdown?.transport || 1500;
}

/**
 * Returns the total estimated budget for a couple, substituting the cheapest
 * available transport if activeMode is "all" or "any".
 */
export function getAdjustedBudget(
  dest: Destination,
  activeMode: string,
): number {
  let mode = "train";

  if (
    activeMode !== "all" &&
    activeMode !== "any" &&
    dest.transportOptions?.[activeMode as keyof typeof dest.transportOptions]
  ) {
    mode = activeMode;
  } else {
    const entries = Object.entries(dest.transportOptions || {}).filter(
      ([_, v]) => v !== undefined,
    ) as [string, number][];
    if (entries.length > 0) {
      mode = entries.reduce((min, curr) => (curr[1] < min[1] ? curr : min))[0];
    }
  }

  const transportCost = getTransportCost(dest, mode);
  const otherCosts =
    dest.budgetRecommended - (dest.budgetBreakdown?.transport || 1500);
  return otherCosts + transportCost;
}

// Class wrapper kept for DestinationDetails.tsx which calls budgetService.getTransportCost()
// TODO: remove once DestinationDetails is updated to named imports
export const budgetService = {
  getTransportCost,
  getAdjustedBudget,
};
