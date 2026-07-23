import type { Destination } from "@/shared/types/destination";

export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

export function matchesDestination(
  destination: Destination,
  tokens: string[],
): boolean {
  if (tokens.length === 0) return true;

  const searchTargetText = [
    destination.name,
    destination.prefecture,
    destination.region,
    destination.notes || "",
    destination.description || "",
    destination.bestSeason || "",
    ...(destination.tags || []),
    ...(destination.categories || []),
    ...(destination.highlights || []),
  ]
    .join(" ")
    .toLowerCase();

  return tokens.every((token) => searchTargetText.includes(token));
}
