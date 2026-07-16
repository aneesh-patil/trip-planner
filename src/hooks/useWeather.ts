import { useState, useEffect } from "react";

export interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

// Map WMO weather codes to simple descriptions and icons
export function getWeatherDescription(code: number): { text: string; icon: "sun" | "cloud" | "rain" | "snow" | "storm" } {
  if (code <= 3) return { text: "Clear/Cloudy", icon: "sun" };
  if (code <= 49) return { text: "Fog/Cloudy", icon: "cloud" };
  if (code <= 69) return { text: "Rain", icon: "rain" };
  if (code <= 79) return { text: "Snow", icon: "snow" };
  if (code <= 82) return { text: "Rain Showers", icon: "rain" };
  if (code <= 86) return { text: "Snow Showers", icon: "snow" };
  if (code <= 99) return { text: "Thunderstorm", icon: "storm" };
  return { text: "Unknown", icon: "cloud" };
}

export function useWeekendWeather(lat?: number, lng?: number) {
  const [forecast, setForecast] = useState<WeatherForecast[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        // Fetch 7 days forecast
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`);
        const data = await res.json();
        
        if (!data.daily) throw new Error("No data");

        // Find Saturday and Sunday
        const weekendData: WeatherForecast[] = [];
        
        for (let i = 0; i < data.daily.time.length; i++) {
          const date = new Date(data.daily.time[i]);
          const dayOfWeek = date.getDay();
          
          // 6 is Saturday, 0 is Sunday
          if (dayOfWeek === 6 || dayOfWeek === 0) {
            weekendData.push({
              date: data.daily.time[i],
              maxTemp: Math.round(data.daily.temperature_2m_max[i]),
              minTemp: Math.round(data.daily.temperature_2m_min[i]),
              weatherCode: data.daily.weathercode[i],
            });
            
            // Only get the *next* weekend
            if (weekendData.length === 2) break;
          }
        }
        
        setForecast(weekendData);
      } catch (err) {
        console.error(err);
        setError("Failed to load forecast");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [lat, lng]);

  return { forecast, loading, error };
}
