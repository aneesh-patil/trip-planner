import type { Destination } from "@/shared/types/destination";

const CAR_RENTAL_RATES = {
  upTo6h: 7370,
  upTo12h: 7920,
  upTo24h: 10340,
  extraPerHour: 1540,
} as const;
const GAS_PRICE_PER_LITER = 175; // ¥175/L current avg
const TOLL_RATE_PER_KM = 30; // ~¥30/km for NEXCO highways

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
 * Returns the round-trip transport cost for the given party size.
 * This is the single source of truth.
 */
export function getTransportCost(
  dest: Destination,
  mode: string,
  partySize: number = 2,
): number {
  if (
    mode === "shinkansen" &&
    dest.transportOptions?.shinkansen !== undefined
  ) {
    const mins = dest.transportOptions.shinkansen;
    // Shinkansen per-person one-way = ¥1,200 base + mins * ¥160 (includes reserved seat surcharge)
    const oneWayPerPerson = 1200 + mins * 160;
    const roundTripPerPerson = oneWayPerPerson * 2;
    return Math.floor(roundTripPerPerson * partySize);
  }

  if (mode === "bus" && dest.transportOptions?.bus !== undefined) {
    const mins = dest.transportOptions.bus;
    // Highway Bus per-person one-way = ¥1,000 + mins * ¥16
    const oneWayPerPerson = 1000 + mins * 16;
    const roundTripPerPerson = oneWayPerPerson * 2;
    return Math.floor(roundTripPerPerson * partySize);
  }

  if (mode === "car" && dest.transportOptions?.car !== undefined) {
    const driveTimeOneWayMin = dest.transportOptions.car;
    const distanceKm = driveTimeOneWayMin * 1.2;
    const tripDurationHours = dest.totalTripHours || 8;
    const rentalFee = getRentalBaseFee(tripDurationHours);
    const tollsRoundTrip = Math.floor(distanceKm * TOLL_RATE_PER_KM * 2);
    const gasRoundTrip = Math.floor(
      ((distanceKm * 2) / 13) * GAS_PRICE_PER_LITER, // 13 km/L avg rental car
    );
    const carsNeeded = Math.ceil(partySize / 4);
    return (rentalFee + tollsRoundTrip + gasRoundTrip) * carsNeeded;
  }

  if (mode === "my_car" && dest.transportOptions?.my_car !== undefined) {
    const driveTimeOneWayMin = dest.transportOptions.my_car;
    const distanceKm = driveTimeOneWayMin * 1.2;
    const tollsRoundTrip = Math.floor(distanceKm * TOLL_RATE_PER_KM * 2);
    const gasRoundTrip = Math.floor(
      ((distanceKm * 2) / 13) * GAS_PRICE_PER_LITER, // 13 km/L avg car
    );
    const carsNeeded = Math.ceil(partySize / 4);
    return (tollsRoundTrip + gasRoundTrip) * carsNeeded;
  }

  if (mode === "train" && dest.transportOptions?.train !== undefined) {
    const mins = dest.transportOptions.train;
    // Trains > 70 mins usually require Limited Express surcharges (e.g. Romancecar, Hitachi, Azusa)
    const isLimitedExpress = mins > 70;
    const oneWayPerPerson = isLimitedExpress
      ? 800 + mins * 40
      : Math.max(400, 150 + mins * 25);
    const roundTripPerPerson = oneWayPerPerson * 2;
    return Math.floor(roundTripPerPerson * partySize);
  }

  return ((dest.budgetBreakdown?.transport || 3000) / 2) * partySize;
}

/**
 * Returns the total estimated budget for the party size, substituting the cheapest
 * available transport if activeMode is "all" or "any".
 */
export function getAdjustedBudget(
  dest: Destination,
  activeMode: string,
  partySize: number = 2,
): number {
  let mode = "train";

  if (
    activeMode !== "all" &&
    activeMode !== "any" &&
    dest.transportOptions?.[
      activeMode as keyof typeof dest.transportOptions
    ] !== undefined
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

  const transportCost = getTransportCost(dest, mode, partySize);
  const recBudget = dest.budgetRecommended || dest.budgetMin || 5000;
  const otherCostsCouple =
    recBudget - (dest.budgetBreakdown?.transport || 3000);
  const otherCosts = Math.max(0, (otherCostsCouple / 2) * partySize);
  return otherCosts + transportCost;
}

// Class wrapper kept for DestinationDetails.tsx which calls budgetService.getTransportCost()
// TODO: remove once DestinationDetails is updated to named imports
export const budgetService = {
  getTransportCost,
  getAdjustedBudget,
};
