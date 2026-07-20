import type { Destination } from "@/shared/types/destination";
import destinationsIndex from "@/shared/data/destinations-index.json";

export function getDestinationList(): Partial<Destination>[] {
  return destinationsIndex as Partial<Destination>[];
}

export async function getDestination(id: string): Promise<Destination | null> {
  try {
    const response = await fetch(`/data/destinations/${id}.json`);
    if (!response.ok) throw new Error(`Failed to fetch destination: ${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching destination:", error);
    return null;
  }
}

export async function compareDestinations(
  ids: string[],
): Promise<Destination[]> {
  const results = await Promise.all(ids.map(getDestination));
  return results.filter((d): d is Destination => d !== null);
}

// Object alias kept for components that still call destinationService.method()
export const destinationService = {
  getDestinationList,
  getDestination,
  compareDestinations,
};
