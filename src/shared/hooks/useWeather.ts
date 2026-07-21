import { useState, useEffect } from "react";
import {
  getWeatherDescription as getWeatherDesc,
  getWeekendWeather,
} from "@/shared/services/weather/WeatherService";
import type { WeatherForecast } from "@/shared/services/weather/WeatherService";

export function getWeatherDescription(code: number) {
  return getWeatherDesc(code);
}

export function useWeekendWeather(lat?: number, lng?: number) {
  const [forecast, setForecast] = useState<WeatherForecast[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    let isMounted = true;

    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const weekendData = await getWeekendWeather(lat!, lng!);
        if (isMounted) setForecast(weekendData);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load forecast");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  return { forecast, loading, error };
}
