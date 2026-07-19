const cache = new Map<string, { timestamp: number; data: WeatherForecast[] }>();
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export function getWeatherDescription(code: number): {
  text: string;
  icon: "sun" | "cloud" | "rain" | "snow" | "storm";
} {
  if (code <= 3) return { text: "Clear/Cloudy", icon: "sun" };
  if (code <= 49) return { text: "Fog/Cloudy", icon: "cloud" };
  if (code <= 69) return { text: "Rain", icon: "rain" };
  if (code <= 79) return { text: "Snow", icon: "snow" };
  if (code <= 82) return { text: "Rain Showers", icon: "rain" };
  if (code <= 86) return { text: "Snow Showers", icon: "snow" };
  if (code <= 99) return { text: "Thunderstorm", icon: "storm" };
  return { text: "Unknown", icon: "cloud" };
}

export async function getWeekendWeather(lat: number, lng: number): Promise<WeatherForecast[]> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_DURATION_MS) return cached.data;

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`,
  );
  const data = await res.json();
  if (!data.daily) throw new Error("No weather data");

  const weekendData: WeatherForecast[] = [];
  for (let i = 0; i < data.daily.time.length; i++) {
    const day = new Date(data.daily.time[i]).getDay();
    if (day === 6 || day === 0) {
      weekendData.push({
        date: data.daily.time[i],
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        weatherCode: data.daily.weathercode[i],
      });
      if (weekendData.length === 2) break;
    }
  }

  cache.set(cacheKey, { timestamp: now, data: weekendData });
  return weekendData;
}

// Object alias kept for backwards compatibility
export const weatherService = { getWeatherDescription, getWeekendWeather };
