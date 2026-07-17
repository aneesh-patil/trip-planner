import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudLightning, Snowflake } from "lucide-react";
import type { Destination } from "@/types/destination";

interface WeatherWidgetProps {
  destination: Destination;
}

export default function WeatherWidget({ destination }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination.coordinates) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const { lat, lng } = destination.coordinates!;
        // Open-Meteo current weather API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeatherData(data.current_weather);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (loading) {
    return <div className="h-6 w-16 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse backdrop-blur-sm" />;
  }

  if (!weatherData) return null;

  const code = weatherData.weathercode;
  const temp = Math.round(weatherData.temperature);

  let Icon = Sun;
  let color = "text-amber-500";

  if (code >= 1 && code <= 3) {
    Icon = Cloud;
    color = "text-slate-400";
  } else if (code >= 51 && code <= 67) {
    Icon = CloudRain;
    color = "text-blue-500";
  } else if (code >= 71 && code <= 77) {
    Icon = Snowflake;
    color = "text-sky-300";
  } else if (code >= 80 && code <= 82) {
    Icon = CloudRain;
    color = "text-blue-500";
  } else if (code >= 95) {
    Icon = CloudLightning;
    color = "text-purple-500";
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-xs font-bold text-white tracking-wide">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span>{temp}°</span>
    </div>
  );
}
