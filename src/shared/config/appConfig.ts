export const APP_CONFIG = {
  defaultOrigin: {
    name: "Nakayama Station",
    address: "Nakayama Station, Yokohama, Japan",
  },
  multipliers: {
    couple: 2, // Multiplying transit costs for couples
  },
  weatherApi: {
    baseUrl: "https://api.open-meteo.com/v1",
    cacheDurationMs: 10 * 60 * 1000, // 10 minutes cache
  },
  featureFlags: {
    enableCompareRecommendations: true,
    enableDetailedItineraryView: true,
  }
};
