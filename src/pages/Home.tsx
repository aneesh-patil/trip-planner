import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Search, Utensils, Trees, Palette, Camera, Car, Train, Sun, CloudRain, ThermometerSun, Map as MapIcon, Navigation, Waves, Landmark, Snowflake } from "lucide-react";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import DestinationCard from "@/components/destinations/DestinationCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const allDestinations = destinationsData as Destination[];

  // Smart Planner State
  const [tripType, setTripType] = useState<string>("any");
  const [budget, setBudget] = useState<number>(30000);
  const [transport, setTransport] = useState<string>("any");
  const [weather, setWeather] = useState<string>("any");

  // Calculate Smart Match Score
  const scoredDestinations = useMemo(() => {
    return allDestinations.map(dest => {
      let score = 70; // Base score
      const reasons: string[] = [];

      // Budget Penalty (harsh penalty if over budget)
      if (dest.budgetRecommended > budget) {
        score -= ((dest.budgetRecommended - budget) / 1000) * 3;
      } else {
        score += 5; // Bonus for being under budget
        if (budget - dest.budgetRecommended > 5000) {
          reasons.push("Well under your budget limit");
        }
      }

      // Transport Logic
      if (transport === "train") {
        if (!dest.trainAvailable) score -= 100;
        else { score += 10; reasons.push("Accessible by train"); }
      }
      if (transport === "car") {
        if (!dest.carRecommended && dest.trainAvailable) score -= 10;
        if (dest.carRecommended) { score += 10; reasons.push("Great for driving"); }
      }

      // Trip Type Boosts
      switch (tripType) {
        case "food":
          score += (dest.ratings.food - 5) * 4;
          if (dest.ratings.food >= 9) reasons.push("Excellent local food");
          break;
        case "nature":
          if (dest.tags.includes("Nature") || dest.categories.includes("Mountain")) {
            score += 20; reasons.push("Perfect nature escape");
          }
          break;
        case "history":
          if (dest.categories.includes("History") || dest.categories.includes("Shrine") || dest.tags.includes("Historic")) {
            score += 20; reasons.push("Rich in history & culture");
          }
          break;
        case "art":
          if (dest.categories.includes("Museum") || dest.categories.includes("Art")) {
            score += 20; reasons.push("Great museums & culture");
          }
          break;
        case "sea":
          if (dest.categories.includes("Coast") || dest.categories.includes("Sea")) {
            score += 20; reasons.push("Beautiful coastal views");
          }
          break;
        case "cool":
          if (dest.ratings.summer >= 9) {
            score += 20; reasons.push("Cool & refreshing climate");
          }
          break;
        case "photography":
          score += (dest.ratings.photography - 5) * 4;
          if (dest.ratings.photography >= 9) reasons.push("Highly photogenic spots");
          break;
      }

      // Weather Boosts
      if (weather === "rainy") {
        score += (dest.indoorPercent * 100) * 0.3; // Up to 30 points for being indoors
        if (dest.indoorPercent > 0.6) reasons.push("Mostly indoors (Rain-safe)");
      } else if (weather === "summer") {
        score += (dest.ratings.summer - 5) * 4;
        if (dest.ratings.summer >= 9) reasons.push("Great way to beat the heat");
      }

      // Cap the score between 0 and 99 (or 100 if perfectly matched)
      const finalScore = Math.min(100, Math.max(0, Math.round(score)));

      return { ...dest, matchScore: finalScore, matchReasons: reasons.slice(0, 3) };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [allDestinations, tripType, budget, transport, weather]);

  const topRecommendations = scoredDestinations.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero & Planner Section */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Text */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold mb-6 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Weekend Decision Engine
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mb-6 leading-tight">
                Where should you <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">escape</span> this weekend?
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl mb-10">
                You have one free day. Tell us what you want, and we'll calculate the perfect trip from Yokohama in seconds.
              </p>
              <div className="flex gap-4 w-full md:w-auto">
                <Link to="/destinations" className="w-full md:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-12 px-8 text-base rounded-full bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 border-slate-300 hover:bg-slate-100">
                    Browse All Spots
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
                      <SelectValue placeholder="Select vibe..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 p-1">
                      <SelectItem value="any" className="py-3 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 rounded-lg">
                        <div className="flex items-center"><Sparkles className="w-5 h-5 mr-3 text-slate-400" /> <span className="text-base font-medium">Anything goes</span></div>
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
                      <SelectValue placeholder="Select weather..." />
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
                    </SelectContent>
                  </Select>
                </div>

                {/* Transport */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">How are you getting there?</label>
                  <Select value={transport} onValueChange={(val) => { if (val) setTransport(val); }}>
                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors rounded-xl font-medium text-base">
                      <SelectValue placeholder="Select transport..." />
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
                  <DestinationCard destination={dest} />
                </div>
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center pb-3 border-b border-emerald-200/50 dark:border-emerald-800/50">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Smart Match</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {Math.max(0, Math.round(dest.matchScore || 0))}%
                    </span>
                  </div>
                  {dest.matchReasons && dest.matchReasons.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Why this fits you:</p>
                      {dest.matchReasons.map((r: string, i: number) => (
                        <div key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                          <Sparkles className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}
