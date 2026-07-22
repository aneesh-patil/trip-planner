const cache = new Map<string, string | null>();

export interface WikipediaSummary {
  extract: string;
  url: string;
}

export class WikipediaService {
  /**
   * Fetches Wikipedia article summary for a destination.
   * Returns Wikipedia extract and URL if found, or null to fallback to local description.
   */
  static async fetchSummary(
    name: string,
    prefecture?: string,
  ): Promise<WikipediaSummary | null> {
    const cacheKey = `${name}_${prefecture || ""}`;
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    }

    try {
      // 1. Try direct title query
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          name,
        )}`,
      );

      if (res.ok) {
        const data = await res.json();
        if (
          data.type !== "disambiguation" &&
          data.extract &&
          data.extract.length > 30
        ) {
          const result: WikipediaSummary = {
            extract: data.extract,
            url:
              data.content_urls?.desktop?.page ||
              `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
          };
          cache.set(cacheKey, JSON.stringify(result));
          return result;
        }
      }

      // 2. Fallback search via Wikipedia Search API
      const searchQuery = `${name} ${prefecture || ""} Japan`;
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          searchQuery,
        )}&format=json&origin=*`,
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const firstResult = searchData.query?.search?.[0];
        if (firstResult?.title) {
          const summaryRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              firstResult.title,
            )}`,
          );
          if (summaryRes.ok) {
            const sumData = await summaryRes.json();
            if (
              sumData.type !== "disambiguation" &&
              sumData.extract &&
              sumData.extract.length > 30
            ) {
              const result: WikipediaSummary = {
                extract: sumData.extract,
                url:
                  sumData.content_urls?.desktop?.page ||
                  `https://en.wikipedia.org/wiki/${encodeURIComponent(
                    firstResult.title,
                  )}`,
              };
              cache.set(cacheKey, JSON.stringify(result));
              return result;
            }
          }
        }
      }
    } catch (err) {
      console.warn("Wikipedia summary fetch error:", err);
    }

    cache.set(cacheKey, null);
    return null;
  }
}
