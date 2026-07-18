import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Search, Utensils, Trees, Palette, Camera, Car, Train, TrainFront, Bus, Sun, CloudRain, ThermometerSun, Map as MapIcon, Navigation, Waves, Landmark, Snowflake } from "lucide-react";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import DestinationCard from "@/components/destinations/DestinationCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTripStore } from "@/hooks/useTripStore";
import { getAdjustedBudget } from "@/lib/utils";

export default function Home() {
  const allDestinations = destinationsData as Destination[];

  const { isVisited } = useTripStore();

  // Smart Planner State
  const [tripType, setTripType] = useState<string>("any");
  const [budget, setBudget] = useState<number>(30000);
  const [transport, setTransport] = useState<string>("any");
  const [weather, setWeather] = useState<string>("any");

  // Current Situation State (Yokohama)
  interface DayContext { temp: number; desc: string; date: string; label: string; }
  const [forecastDays, setForecastDays] = useState<DayContext[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=35.45&longitude=139.63&daily=weathercode,temperature_2m_max&timezone=Asia%2FTokyo&forecast_days=3`;
        const res = await fetch(url);
        const data = await res.json();
        
        const days: DayContext[] = [];
        
        for (let i = 0; i < 3; i++) {
          const temp = Math.round(data.daily.temperature_2m_max[i]);
          const code = data.daily.weathercode[i];
          
          let desc = "Clear";
          if (code >= 1 && code <= 3) desc = "Cloudy";
          if (code >= 51 && code <= 67) desc = "Rainy";
          if (code >= 71 && code <= 77) desc = "Snow";
          if (code >= 80 && code <= 99) desc = "Stormy";

          const dateObj = new Date(data.daily.time[i]);
          const dateString = dateObj.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
          
          let label = "Today";
          if (i === 1) label = "Tomorrow";
          if (i === 2) label = dateObj.toLocaleDateString("en-US", { weekday: 'short' });

          days.push({ temp, desc, date: dateString, label });
        }
        
        setForecastDays(days);
      } catch (e) {
        console.error(e);
      }
    };
    fetchContext();
  }, []);

  const currentSituation = forecastDays[selectedDayIndex] || null;

  // Calculate Smart Match Score
  const scoredDestinations = useMemo(() => {
    return allDestinations
      .filter(dest => !isVisited(dest.id)) // 0. Filter out already visited places entirely from top matches
      .map(dest => {
      // 1. Base score derived dynamically from the destination's actual overall rating
      // e.g., an 8.5 rating -> 20 + 51 = 71 base score. This naturally breaks ties.
      let score = 20 + (dest.ratings.overall * 6); 
      const reasons: string[] = [];

      // 2. Budget Logic (Continuous penalty/bonus)
      const adjustedBudget = getAdjustedBudget(dest, transport);
      if (adjustedBudget > budget) {
        score -= ((adjustedBudget - budget) / 1000) * 1.5;
      } else {
        const budgetBonus = Math.min(8, ((budget - adjustedBudget) / 3000));
        score += budgetBonus;
        if (budget - adjustedBudget >= 5000) {
          reasons.push(`Well under budget (est. ¥${adjustedBudget.toLocaleString()})`);
        }
      }

      // 3. Transport Logic (Granular distance-based scoring)
      if (transport === "train") {
        if (!dest.transportOptions?.train) {
          score -= 1000; 
        } else {
          const time = dest.transportOptions.train;
          const timeBonus = Math.max(0, 12 - (time / 10)); // Faster trains get up to +12
          score += 4 + timeBonus;
          if (time <= 60) reasons.push(`Fast train access (${time}m)`);
        }
      } else if (transport === "car") {
        if (!dest.transportOptions?.car) score -= 1000;
        if (dest.transportOptions?.car) {
          const time = dest.transportOptions.car;
          const timeBonus = Math.max(0, 10 - (time / 15));
          score += 5 + timeBonus; 
          if (time <= 60) reasons.push(`Easy drive (${time}m)`);
        }
      } else if (transport === "shinkansen") {
        if (!dest.transportOptions?.shinkansen) {
          score -= 1000; 
        } else {
          const time = dest.transportOptions.shinkansen;
          score += 10;
          reasons.push(`Accessible by Shinkansen (${time}m)`);
        }
      } else if (transport === "bus") {
        if (!dest.transportOptions?.bus) {
          score -= 1000; 
        } else {
          const time = dest.transportOptions.bus;
          score += 10;
          reasons.push(`Accessible by Highway Bus (${time}m)`);
        }
      } else {
        const times = Object.values(dest.transportOptions || {}).filter((t): t is number => t !== undefined);
        const minTime = times.length > 0 ? Math.min(...times) : 999;
        score += Math.max(0, 5 - (minTime / 30)); // Slight bump for closer destinations overall
      }

      // 4. Trip Type Logic (Using continuous metrics instead of rigid booleans)
      switch (tripType) {
        case "food":
          score += (dest.ratings.food - 5) * 4.5; // 9 -> +18, 5 -> 0, 4 -> -4.5
          if (dest.ratings.food >= 8.5) reasons.push("Top-tier local food scene");
          break;
        case "nature":
          if (dest.tags.includes("Nature") || dest.categories.includes("Mountain")) {
            score += 12 + (dest.ratings.photography * 1.5); // proxy for beauty
            reasons.push("Beautiful nature escape");
          } else score -= 25;
          break;
        case "history":
          if (dest.categories.includes("History") || dest.categories.includes("Shrine") || dest.tags.includes("Historic")) {
            score += 18; reasons.push("Deep historical significance");
          } else score -= 20;
          break;
        case "art":
          if (dest.categories.includes("Museum") || dest.categories.includes("Art")) {
            score += 18; reasons.push("Rich in museums & art");
          } else score -= 20;
          break;
        case "sea":
          if (dest.categories.includes("Coast") || dest.categories.includes("Sea") || dest.categories.includes("Beach")) {
            score += 18; reasons.push("Gorgeous coastal atmosphere");
          } else score -= 35; 
          break;
        case "cool":
          score += (dest.ratings.summer - 5) * 4.5;
          if (dest.ratings.summer >= 8.5) reasons.push("Cool & refreshing climate");
          break;
        case "photography":
          score += (dest.ratings.photography - 5) * 5;
          if (dest.ratings.photography >= 8.5) reasons.push("Incredibly photogenic spots");
          break;
        case "themepark":
          if (dest.categories.includes("Theme Park")) {
            score += 30; reasons.push("World-class theme park");
          } else score -= 45;
          break;
        case "any":
          score += (dest.ratings.overall - 7.5) * 3; // Boost places that are just generally amazing
          break;
      }

      // 5. Automatic Weather & Environmental Logic (Reacts to the selected day's forecast)
      if (currentSituation) {
        const isRaining = currentSituation.desc === "Rainy" || currentSituation.desc === "Stormy";
        const isHot = currentSituation.temp >= 30;

        if (isRaining || weather === "rainy") {
          const indoorBonus = (dest.indoorPercent / 100) * 25;
          score += indoorBonus;
          if (dest.indoorPercent >= 70) reasons.push(`${Math.round(dest.indoorPercent)}% indoor (perfect for rain)`);
          if (dest.indoorPercent < 30) score -= 30; // Heavy penalty for outdoor places in rain
        } 
        
        if (isHot || weather === "summer") {
          score += (dest.ratings.summer - 5) * 4;
          if (dest.ratings.summer >= 8.5) reasons.push(`Cool retreat from ${currentSituation.temp}°C heat`);
          if (dest.ratings.summer <= 4) score -= 20; // Penalty for hot walking places
        }

        const isCold = currentSituation.temp <= 10;
        if (isCold || weather === "winter") {
          score += (dest.ratings.winter - 5) * 4;
          if (dest.ratings.winter >= 8.5) reasons.push("Magical winter atmosphere");
          if (dest.ratings.winter <= 4) score -= 20; 
        }

        if (!isRaining && !isHot && weather === "any") {
          score += (dest.ratings.photography - 6) * 1.5; // Good weather makes beautiful places better
        }
      }

      // Fallback reason
      if (reasons.length === 0) {
        if (dest.ratings.overall >= 8.5) reasons.push("Highly rated all-around choice");
        else reasons.push("Solid match for your criteria");
      }

      // 6. Cap and round score to 1 decimal place to prevent ties
      const finalScore = Math.min(99.9, Math.max(0.1, score));

      return { ...dest, matchScore: finalScore, matchReasons: reasons.slice(0, 3) };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [allDestinations, tripType, budget, transport, weather, isVisited, currentSituation]);

  const topRecommendations = scoredDestinations.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero & Planner Section */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Contextual Hero */}
            <div className="flex flex-col items-start text-left w-full">
              {currentSituation ? (
                <div className="mb-10 w-full">
                  <div className="flex gap-2 mb-6">
                    {forecastDays.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all focus:outline-none focus:ring-0 outline-none ${selectedDayIndex === idx ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold mb-2 tracking-widest uppercase text-xs">{currentSituation.date}</p>
                  <div className="flex items-center text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                    <span>{currentSituation.temp}°C</span>
                    <span className="mx-4 text-slate-200 dark:text-slate-800">|</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">{currentSituation.desc} in Yokohama</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mt-6 leading-tight">
                    Based on {selectedDayIndex === 0 ? "today's" : selectedDayIndex === 1 ? "tomorrow's" : "the"} conditions,<br/>you should go to...
                  </h1>
                </div>
              ) : (
                <div className="h-40 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-lg mb-10" />
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xl" 
                  onClick={() => document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reveal Top Match
                </Button>
                <Link to="/destinations" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 px-8 text-lg font-bold rounded-full bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 border-slate-300 hover:bg-slate-100">
                    Browse All
                  </Button>
                </Link>
              </div>
            </div>

            {/* Smart Planner Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative">
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform rotate-3">
                Find your trip in 30s
              </div>
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
                <Navigation className="w-6 h-6 mr-2 text-emerald-500" />
                Trip Planner
              </h3>
              
              <div className="space-y-6">
                {/* Trip Type */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">What's the vibe?</label>
                  <Select value={tripType} onValueChange={(val) => { if (val) setTripType(val); }}>
                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
                      {tripType === "any" && <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-slate-400" /> Anything goes</div>}
                      {tripType === "themepark" && <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-pink-500" /> Theme Parks</div>}
                      {tripType === "sea" && <div className="flex items-center"><Waves className="w-5 h-5 mr-3 text-blue-500" /> Sea Escape</div>}
                      {tripType === "history" && <div className="flex items-center"><Landmark className="w-5 h-5 mr-3 text-amber-700" /> History & Culture</div>}
                      {tripType === "art" && <div className="flex items-center"><Palette className="w-5 h-5 mr-3 text-purple-500" /> Art & Museums</div>}
                      {tripType === "food" && <div className="flex items-center"><Utensils className="w-5 h-5 mr-3 text-orange-500" /> Food & Eating</div>}
                      {tripType === "nature" && <div className="flex items-center"><Trees className="w-5 h-5 mr-3 text-emerald-500" /> Nature & Outdoors</div>}
                      {tripType === "cool" && <div className="flex items-center"><Snowflake className="w-5 h-5 mr-3 text-sky-400" /> Cool Escape</div>}
                      {tripType === "photography" && <div className="flex items-center"><Camera className="w-5 h-5 mr-3 text-rose-400" /> Photography</div>}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
                      <SelectItem value="any" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-slate-400" /> <span className="text-base font-medium">Anything goes</span></div>
                      </SelectItem>
                      <SelectItem value="themepark" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-pink-500" /> <span className="text-base font-medium">Theme Parks</span></div>
                      </SelectItem>
                      <SelectItem value="sea" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Waves className="w-5 h-5 mr-3 text-blue-500" /> <span className="text-base font-medium">Sea Escape</span></div>
                      </SelectItem>
                      <SelectItem value="history" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Landmark className="w-5 h-5 mr-3 text-amber-700" /> <span className="text-base font-medium">History & Culture</span></div>
                      </SelectItem>
                      <SelectItem value="art" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Palette className="w-5 h-5 mr-3 text-purple-500" /> <span className="text-base font-medium">Art & Museums</span></div>
                      </SelectItem>
                      <SelectItem value="food" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Utensils className="w-5 h-5 mr-3 text-orange-500" /> <span className="text-base font-medium">Food & Eating</span></div>
                      </SelectItem>
                      <SelectItem value="nature" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Trees className="w-5 h-5 mr-3 text-emerald-500" /> <span className="text-base font-medium">Nature & Outdoors</span></div>
                      </SelectItem>
                      <SelectItem value="cool" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Snowflake className="w-5 h-5 mr-3 text-sky-400" /> <span className="text-base font-medium">Cool Escape</span></div>
                      </SelectItem>
                      <SelectItem value="photography" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Camera className="w-5 h-5 mr-3 text-rose-400" /> <span className="text-base font-medium">Photography</span></div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weather */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Weather condition?</label>
                  <Select value={weather} onValueChange={(val) => { if (val) setWeather(val); }}>
                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
                      {weather === "any" && <div className="flex items-center"><Sun className="w-5 h-5 mr-3 text-amber-500" /> Perfect Weather</div>}
                      {weather === "rainy" && <div className="flex items-center"><CloudRain className="w-5 h-5 mr-3 text-blue-500" /> Looks like Rain</div>}
                      {weather === "summer" && <div className="flex items-center"><ThermometerSun className="w-5 h-5 mr-3 text-red-500" /> Scorching Hot</div>}
                      {weather === "winter" && <div className="flex items-center"><Snowflake className="w-5 h-5 mr-3 text-sky-400" /> Freezing Cold</div>}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
                      <SelectItem value="any" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Sun className="w-5 h-5 mr-3 text-amber-500" /> <span className="text-base font-medium">Perfect Weather</span></div>
                      </SelectItem>
                      <SelectItem value="rainy" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><CloudRain className="w-5 h-5 mr-3 text-blue-500" /> <span className="text-base font-medium">Looks like Rain</span></div>
                      </SelectItem>
                      <SelectItem value="summer" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><ThermometerSun className="w-5 h-5 mr-3 text-red-500" /> <span className="text-base font-medium">Scorching Hot</span></div>
                      </SelectItem>
                      <SelectItem value="winter" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Snowflake className="w-5 h-5 mr-3 text-sky-400" /> <span className="text-base font-medium">Freezing Cold</span></div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transport */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">How are you getting there?</label>
                  <Select value={transport} onValueChange={(val) => { if (val) setTransport(val); }}>
                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
                      {transport === "any" && <div className="flex items-center"><MapIcon className="w-5 h-5 mr-3 text-slate-400" /> No preference</div>}
                      {transport === "train" && <div className="flex items-center"><Train className="w-5 h-5 mr-3 text-emerald-600" /> Train Only</div>}
                      {transport === "car" && <div className="flex items-center"><Car className="w-5 h-5 mr-3 text-slate-600" /> Driving a Car</div>}
                      {transport === "shinkansen" && <div className="flex items-center"><TrainFront className="w-5 h-5 mr-3 text-purple-600" /> Shinkansen</div>}
                      {transport === "bus" && <div className="flex items-center"><Bus className="w-5 h-5 mr-3 text-amber-600" /> Highway Bus</div>}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
                      <SelectItem value="any" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><MapIcon className="w-5 h-5 mr-3 text-slate-400" /> <span className="text-base font-medium">No preference</span></div>
                      </SelectItem>
                      <SelectItem value="train" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Train className="w-5 h-5 mr-3 text-emerald-600" /> <span className="text-base font-medium">Train Only</span></div>
                      </SelectItem>
                      <SelectItem value="car" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Car className="w-5 h-5 mr-3 text-slate-600" /> <span className="text-base font-medium">Driving a Car</span></div>
                      </SelectItem>
                      <SelectItem value="shinkansen" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><TrainFront className="w-5 h-5 mr-3 text-purple-600" /> <span className="text-base font-medium">Shinkansen</span></div>
                      </SelectItem>
                      <SelectItem value="bus" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Bus className="w-5 h-5 mr-3 text-amber-600" /> <span className="text-base font-medium">Highway Bus</span></div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Max Budget (couple)</label>
                    <span className="text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md">
                      ¥{budget.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[budget]}
                    max={100000}
                    step={5000}
                    onValueChange={(val: number | readonly number[]) => setBudget(Array.isArray(val) ? val[0] : val)}
                    className="w-full"
                  />
                </div>

                <Button 
                  className="w-full h-12 mt-4 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  onClick={() => {
                    document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find My Match
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Top Recommendations */}
      <section id="recommendations" className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Your Top Matches</h2>
              <p className="text-slate-500 dark:text-slate-400">Ranked by our algorithm based on your preferences.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRecommendations.map((dest, index) => (
              <div key={dest.id} className="relative flex flex-col h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-black text-xl z-10 shadow-lg border-4 border-white dark:border-background">
                  #{index + 1}
                </div>
                <div className="flex-grow">
                  <DestinationCard destination={dest} activeTransportMode={transport} />
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}
