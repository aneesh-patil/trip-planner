import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Destination } from "@/types/destination";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTransportCost(dest: Destination, mode: string): number {
  const baseTransport = dest.budgetBreakdown?.transport || 1500;
  
  if (mode === "shinkansen" && dest.transportOptions?.shinkansen) {
    return Math.max(baseTransport, 2500 + (dest.transportOptions.shinkansen * 120));
  } else if (mode === "bus" && dest.transportOptions?.bus) {
    return Math.max(1000, dest.transportOptions.bus * 20);
  } else if (mode === "car" && dest.transportOptions?.car) {
    return Math.max(1000, dest.transportOptions.car * 30);
  } else if (mode === "train" && dest.transportOptions?.train) {
    return Math.max(800, dest.transportOptions.train * 30);
  }
  
  return baseTransport;
}

export function getAdjustedBudget(dest: Destination, activeMode: string): number {
  let mode = "train";
  
  if (activeMode !== "all" && activeMode !== "any" && dest.transportOptions?.[activeMode as keyof typeof dest.transportOptions]) {
    mode = activeMode;
  } else {
    const to = dest.transportOptions || {};
    const entries = Object.entries(to).filter(([_, v]) => v !== undefined) as [string, number][];
    if (entries.length > 0) {
      const fastest = entries.reduce((min, curr) => curr[1] < min[1] ? curr : min);
      mode = fastest[0];
    }
  }

  const transportCost = getTransportCost(dest, mode);
  const otherCosts = dest.budgetRecommended - (dest.budgetBreakdown?.transport || 1500);
  return otherCosts + transportCost;
}
