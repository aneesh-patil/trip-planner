import { APP_CONFIG } from "@/shared/config/appConfig";

export interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

class WeatherService {
  private cache = new Map<
    string,
    { timestamp: number; data: WeatherForecast[] }
  >();

  public getWeatherDescription(code: number): {
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

  public async getWeekendWeather(
    lat: number,
    lng: number,
  ): Promise<WeatherForecast[]> {
    const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    if (
      cached &&
      now - cached.timestamp < APP_CONFIG.weatherApi.cacheDurationMs
    ) {
      return cached.data;
    }

    const res = await fetch(
      `${APP_CONFIG.weatherApi.baseUrl}/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`,
    );
    const data = await res.json();

    if (!data.daily) throw new Error("No data");

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
        if (weekendData.length === 2) break;
      }
    }

    this.cache.set(cacheKey, { timestamp: now, data: weekendData });
    return weekendData;
  }
}

export const weatherService = new WeatherService();
