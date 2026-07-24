import collectionsData from "./collections-index.json";
import type { Collection } from "@/shared/types/collection";

const collections: Collection[] = collectionsData as Collection[];

/**
 * Returns all curated collections ordered by sortOrder.
 */
export function getCollections(): Collection[] {
  return [...collections].sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Find a collection by unique ID.
 */
export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}

/**
 * Find a collection by URL slug.
 */
export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
