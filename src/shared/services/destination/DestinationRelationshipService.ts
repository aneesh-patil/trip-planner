import type { Destination } from "@/shared/types/destination";
import { getDestinationList } from "./DestinationService";

export class DestinationRelationshipService {
  private static byIdMap: Map<string, Destination> | null = null;
  private static childrenByParentMap: Map<string, Destination[]> | null = null;

  private static ensureIndex() {
    if (this.byIdMap) return;

    const all = getDestinationList() as Destination[];
    this.byIdMap = new Map();
    this.childrenByParentMap = new Map();

    for (const dest of all) {
      if (!dest.id) continue;
      this.byIdMap.set(dest.id, dest);

      const parentId = dest.relationships?.parentDestinationId;
      if (parentId) {
        if (!this.childrenByParentMap.has(parentId)) {
          this.childrenByParentMap.set(parentId, []);
        }
        this.childrenByParentMap.get(parentId)!.push(dest);
      }
    }
  }

  /**
   * Resets the cache index (useful when destination list mutates dynamically).
   */
  static clearIndex() {
    this.byIdMap = null;
    this.childrenByParentMap = null;
  }

  /**
   * Returns the parent container destination (e.g. Nagoya Castle -> Nagoya City).
   */
  static getParentDestination(destination: Destination): Destination | null {
    this.ensureIndex();
    const parentId = destination.relationships?.parentDestinationId;
    if (!parentId) return null;
    return this.byIdMap?.get(parentId) || null;
  }

  /**
   * Returns child attractions assigned to a parent hub.
   */
  static getChildDestinations(parentId: string): Destination[] {
    this.ensureIndex();
    return this.childrenByParentMap?.get(parentId) || [];
  }

  /**
   * Returns editorially featured top sights for a hub page.
   */
  static getFeaturedChildDestinations(city: Destination): Destination[] {
    this.ensureIndex();
    const featuredIds = city.relationships?.featuredDestinationIds;

    if (featuredIds && featuredIds.length > 0) {
      return featuredIds
        .map((id) => this.byIdMap?.get(id))
        .filter((d): d is Destination => Boolean(d));
    }

    // Fallback: child attractions assigned to this hub
    return this.getChildDestinations(city.id).slice(0, 4);
  }

  /**
   * Returns nearby destinations following precedence:
   * 1. Explicit nearbyDestinationIds
   * 2. Sights sharing the same parentDestinationId
   * 3. Sights in the same prefecture
   */
  static getNearbyDestinations(destination: Destination): Destination[] {
    this.ensureIndex();
    const rels = destination.relationships;

    // Precedence 1: Explicit nearbyDestinationIds
    if (rels?.nearbyDestinationIds && rels.nearbyDestinationIds.length > 0) {
      return rels.nearbyDestinationIds
        .map((id) => this.byIdMap?.get(id))
        .filter((d): d is Destination => Boolean(d));
    }

    // Precedence 2: Sister attractions in same parent container
    if (rels?.parentDestinationId) {
      const siblings = this.getChildDestinations(rels.parentDestinationId);
      const filtered = siblings.filter((d) => d.id !== destination.id);
      if (filtered.length > 0) return filtered.slice(0, 4);
    }

    // Precedence 3: Same prefecture
    const all = Array.from(this.byIdMap?.values() || []);
    return all
      .filter(
        (d) =>
          d.prefecture === destination.prefecture && d.id !== destination.id,
      )
      .slice(0, 4);
  }

  /**
   * Returns thematically related destinations ("You may also like").
   */
  static getRelatedDestinations(destination: Destination): Destination[] {
    this.ensureIndex();
    const rels = destination.relationships;

    if (rels?.relatedDestinationIds && rels.relatedDestinationIds.length > 0) {
      return rels.relatedDestinationIds
        .map((id) => this.byIdMap?.get(id))
        .filter((d): d is Destination => Boolean(d));
    }

    return [];
  }
}
