import { useState, useEffect } from "react";
import {
  fetchWeatherTabContext,
  type WeatherTabContext,
  type WeatherTab,
} from "@/shared/services/weather/WeatherTabService";

export function useWeatherContext(
  homeStationCoords: { lat: number; lng: number } | null,
) {
  const [weatherContext, setWeatherContext] =
    useState<WeatherTabContext | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>("today");
  const [customDate, setCustomDate] = useState<string | null>(null);

  useEffect(() => {
    const lat = homeStationCoords?.lat || 35.6762;
    const lng = homeStationCoords?.lng || 139.6503;
    fetchWeatherTabContext(lat, lng)
      .then((ctx) => {
        setWeatherContext(ctx);
        setActiveTabId(ctx.activeTabId);
      })
      .catch((err) => console.error("Weather tab fetch error:", err));
  }, [homeStationCoords]);

  const handleCustomDateSelect = (selectedDate: string) => {
    if (!weatherContext) return;
    const matchingPreset = weatherContext.tabs.find(
      (t) => !t.isCustom && t.dates.includes(selectedDate),
    );

    if (matchingPreset) {
      const cleanTabs = weatherContext.tabs.filter((t) => !t.isCustom);
      setWeatherContext({
        ...weatherContext,
        tabs: cleanTabs,
      });
      setCustomDate(null);
      setActiveTabId(matchingPreset.id);
    } else {
      const customTabId = `custom_${selectedDate}`;
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      const label = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const customTab: WeatherTab = {
        id: customTabId,
        label,
        dates: [selectedDate],
        isCustom: true,
      };

      const baseTabs = weatherContext.tabs.filter((t) => !t.isCustom);
      setWeatherContext({
        ...weatherContext,
        tabs: [...baseTabs, customTab],
      });
      setActiveTabId(customTabId);
      setCustomDate(selectedDate);
    }
  };

  const currentTab = weatherContext?.tabs.find((t) => t.id === activeTabId);

  return {
    weatherContext,
    setWeatherContext,
    activeTabId,
    setActiveTabId,
    customDate,
    setCustomDate,
    currentTab,
    handleCustomDateSelect,
  };
}
