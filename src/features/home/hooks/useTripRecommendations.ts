import { useMemo } from "react";
import type { Destination } from "@/shared/types/destination";
import type { WeatherTab } from "@/shared/services/weather/WeatherTabService";
import { getRecommendations } from "@/shared/services/recommendation/RecommendationService";

interface UseTripRecommendationsProps {
  allDestinations: Destination[];
  currentTab: WeatherTab | undefined;
  weatherContextMap: Map<string, { desc: string; icon: string }> | undefined;
  tripType: string;
  budget: number;
  carMode: string;
  publicModes: string[];
  partySize: number;
  weather: string;
  homeStationCoords: { lat: number; lng: number } | null;
  isVisited: (id: string) => boolean;
}

export function useTripRecommendations({
  allDestinations,
  currentTab,
  weatherContextMap,
  tripType,
  budget,
  carMode,
  publicModes,
  partySize,
  weather,
  homeStationCoords,
  isVisited,
}: UseTripRecommendationsProps) {
  const recommendedDestinations = useMemo(() => {
    let activeWeatherStr = weather;
    if (currentTab && weatherContextMap) {
      const dayData = weatherContextMap.get(currentTab.dates[0]);
      if (dayData) {
        activeWeatherStr = dayData.desc;
      }
    }

    return getRecommendations(allDestinations, {
      tripType,
      budget,
      carMode,
      publicModes,
      partySize,
      weather: activeWeatherStr,
      visitedIds: [],
      homeStationCoords: homeStationCoords || { lat: 35.6812, lng: 139.7671 },
    });
  }, [
    allDestinations,
    currentTab,
    weatherContextMap,
    tripType,
    budget,
    carMode,
    publicModes,
    partySize,
    weather,
    homeStationCoords,
  ]);

  const rouletteCandidates = useMemo(() => {
    return getRecommendations(allDestinations, {
      tripType: "any",
      budget: 100000,
      carMode,
      publicModes,
      partySize,
      weather: "any",
      visitedIds: allDestinations
        .filter((d) => isVisited(d.id))
        .map((d) => d.id),
      homeStationCoords: homeStationCoords || { lat: 35.6812, lng: 139.7671 },
    });
  }, [
    allDestinations,
    carMode,
    publicModes,
    partySize,
    homeStationCoords,
    isVisited,
  ]);

  return {
    recommendedDestinations,
    rouletteCandidates,
  };
}
