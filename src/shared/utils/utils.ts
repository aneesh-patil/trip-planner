import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Transport/budget helpers live in BudgetService.ts — import from there.
export { getTransportCost, getAdjustedBudget } from "@/shared/services/budget/BudgetService";
