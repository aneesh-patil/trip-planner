import type { Destination } from "@/shared/types/destination";
import destinationsIndex from "@/shared/data/destinations-index.json";

class DestinationService {
  /**
   * Returns the lightweight list of all destinations (from index).
   */
  public getDestinationList(): Partial<Destination>[] {
    return destinationsIndex as Partial<Destination>[];
  }

  /**
   * Fetches the full rich detail data for a specific destination asynchronously.
   */
  public async getDestination(id: string): Promise<Destination | null> {
    try {
      const response = await fetch(`/data/destinations/${id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch destination details for ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching destination details:", error);
      return null;
    }
  }

  /**
   * Returns details for a subset of destinations for comparison.
   */
  public async compareDestinations(ids: string[]): Promise<Destination[]> {
    const promises = ids.map(id => this.getDestination(id));
    const results = await Promise.all(promises);
    return results.filter((d): d is Destination => d !== null);
  }
}

export const destinationService = new DestinationService();
