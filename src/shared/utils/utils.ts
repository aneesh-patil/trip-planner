import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Destination } from "@/shared/types/destination";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CAR_RENTAL_RATES = {
  upTo6h: 7370,
  upTo12h: 7920,
  upTo24h: 10340,
  extra24h: 8690,
  extraPerHour: 1540,
} as const;

const GAS_PRICE_PER_LITER = 170;
const TOLL_RATE_PER_KM = 25;
const PARTY_SIZE = 2;

function getRentalBaseFee(tripDurationHours: number): number {
  if (tripDurationHours <= 6) return CAR_RENTAL_RATES.upTo6h;
  if (tripDurationHours <= 12) return CAR_RENTAL_RATES.upTo12h;
  if (tripDurationHours <= 24) return CAR_RENTAL_RATES.upTo24h;
  const extraHours = tripDurationHours - 24;
  return (
    CAR_RENTAL_RATES.upTo24h +
    Math.ceil(extraHours) * CAR_RENTAL_RATES.extraPerHour
  );
}

export function getTransportCost(dest: Destination, mode: string): number {
  if (mode === "shinkansen" && dest.transportOptions?.shinkansen) {
    const time = dest.transportOptions.shinkansen;
    const perPersonCost = Math.floor(3000 + time * 150);
    return perPersonCost * PARTY_SIZE;
  }

  if (mode === "bus" && dest.transportOptions?.bus) {
    const time = dest.transportOptions.bus;
    const perPersonCost = Math.floor(2000 + time * 15);
    return perPersonCost * PARTY_SIZE;
  }

  if (mode === "car" && dest.transportOptions?.car) {
    const driveTimeOneWayMin = dest.transportOptions.car;
    const distanceKm = driveTimeOneWayMin * 1.2;

    // We use totalTripHours if available, otherwise assume 8 hours
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
    const perPersonRoundTrip = Math.max(600, Math.floor(time * 34.3));
    return perPersonRoundTrip * PARTY_SIZE;
  }

  return dest.budgetBreakdown?.transport || 1500;
}

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
    const to = dest.transportOptions || {};
    const entries = Object.entries(to).filter(([_, v]) => v !== undefined) as [
      string,
      number,
    ][];
    if (entries.length > 0) {
      const fastest = entries.reduce((min, curr) =>
        curr[1] < min[1] ? curr : min,
      );
      mode = fastest[0];
    }
  }

  const transportCost = getTransportCost(dest, mode);
  const otherCosts =
    dest.budgetRecommended - (dest.budgetBreakdown?.transport || 1500);
  return otherCosts + transportCost;
}
