import type { Destination } from "@/shared/types/destination";
import destinationsIndex from "@/shared/data/destinations-index.json";

export function getDestinationList(): Partial<Destination>[] {
  const list = destinationsIndex as Partial<Destination>[];
  return list.map((dest) => {
    if (dest.transportOptions?.car && !dest.transportOptions.my_car) {
      dest.transportOptions.my_car = dest.transportOptions.car;
    }
    return dest;
  });
}

export async function getDestination(id: string): Promise<Destination | null> {
  try {
    const response = await fetch(`/data/destinations/${id}.json`);
    if (!response.ok) throw new Error(`Failed to fetch destination: ${id}`);
    const dest = await response.json();
    if (dest.transportOptions?.car && !dest.transportOptions.my_car) {
      dest.transportOptions.my_car = dest.transportOptions.car;
    }
    return dest;
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
