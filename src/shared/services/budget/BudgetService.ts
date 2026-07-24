import type { Destination } from "@/shared/types/destination";

const CAR_RENTAL_RATES = {
  upTo6h: 7370,
  upTo12h: 7920,
  upTo24h: 10340,
  extraPerHour: 1540,
} as const;
const GAS_PRICE_PER_LITER = 175; // ¥175/L current avg

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
 * Single source of truth for transport fare calculation across TabiMap.
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
    // Shinkansen base fare + express surcharge: ¥2,200 + mins * ¥62
    const oneWayPerPerson = Math.round(2200 + mins * 62);
    const roundTripPerPerson = oneWayPerPerson * 2;
    return Math.floor(roundTripPerPerson * partySize);
  }

  if (mode === "bus" && dest.transportOptions?.bus !== undefined) {
    const mins = dest.transportOptions.bus;
    // Highway Bus fare: ¥800 + mins * ¥11
    const oneWayPerPerson = Math.round(800 + mins * 11);
    const roundTripPerPerson = oneWayPerPerson * 2;
    return Math.floor(roundTripPerPerson * partySize);
  }

  if (mode === "car" && dest.transportOptions?.car !== undefined) {
    const driveTimeOneWayMin = dest.transportOptions.car;
    const distanceKm = driveTimeOneWayMin * 1.1;
    const tripDurationHours = dest.totalTripHours || 8;
    const rentalFee = getRentalBaseFee(tripDurationHours);
    const tollsRoundTrip = Math.floor(distanceKm * 18 * 2);
    const gasRoundTrip = Math.floor(
      ((distanceKm * 2) / 14) * GAS_PRICE_PER_LITER,
    );
    const carsNeeded = Math.ceil(partySize / 4);
    return (rentalFee + tollsRoundTrip + gasRoundTrip) * carsNeeded;
  }

  if (mode === "my_car" && dest.transportOptions?.my_car !== undefined) {
    const driveTimeOneWayMin = dest.transportOptions.my_car;
    const distanceKm = driveTimeOneWayMin * 1.1;
    const tollsRoundTrip = Math.floor(distanceKm * 18 * 2);
    const gasRoundTrip = Math.floor(
      ((distanceKm * 2) / 14) * GAS_PRICE_PER_LITER,
    );
    const carsNeeded = Math.ceil(partySize / 4);
    return (tollsRoundTrip + gasRoundTrip) * carsNeeded;
  }

  if (mode === "train" && dest.transportOptions?.train !== undefined) {
    const mins = dest.transportOptions.train;
    // Realistic JR / Private Rail fare curve in Japan based on travel time:
    // mins <= 25: local metro / short train (¥160 - ¥360)
    // 25 < mins <= 65: commuter / suburban train (¥360 - ¥890)
    // mins > 65: regional JR local train / limited express (¥890 + (mins - 65) * 22)
    let oneWayPerPerson: number;
    if (mins <= 25) {
      oneWayPerPerson = Math.round(160 + mins * 8);
    } else if (mins <= 65) {
      oneWayPerPerson = Math.round(250 + (mins - 25) * 16);
    } else {
      oneWayPerPerson = Math.round(890 + (mins - 65) * 22);
    }
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
