import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Search, Heart, Utensils, Trees, Palette, Camera, Car, Train, Sun, CloudRain, ThermometerSun, Map as MapIcon, Navigation } from "lucide-react";
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

      // Budget Penalty (harsh penalty if over budget)
      if (dest.budgetRecommended > budget) {
        score -= ((dest.budgetRecommended - budget) / 1000) * 3;
      } else {
        score += 5; // Bonus for being under budget
      }

      // Transport Logic
      if (transport === "train") {
        if (!dest.trainAvailable) score -= 100;
        else score += 10;
      }
      if (transport === "car") {
        if (!dest.carRecommended && dest.trainAvailable) score -= 10;
        if (dest.carRecommended) score += 10;
      }

      // Trip Type Boosts
      switch (tripType) {
        case "couple":
          score += (dest.ratings.couple - 5) * 4;
          break;
        case "food":
          score += (dest.ratings.food - 5) * 4;
          break;
        case "nature":
          if (dest.tags.includes("Nature") || dest.categories.includes("Mountain") || dest.categories.includes("Coast")) score += 20;
          break;
        case "museum":
          if (dest.categories.includes("Museum") || dest.categories.includes("Art")) score += 20;
          break;
        case "photography":
          score += (dest.ratings.photography - 5) * 4;
          break;
        case "roadtrip":
          if (dest.carRecommended) score += 20;
          break;
      }

      // Weather Boosts
      if (weather === "rainy") {
        score += (dest.indoorPercent * 100) * 0.3; // Up to 30 points for being indoors
      } else if (weather === "summer") {
        score += (dest.ratings.summer - 5) * 4;
      }

      // Cap the score between 0 and 99 (or 100 if perfectly matched)
      const finalScore = Math.min(100, Math.max(0, Math.round(score)));

      return { ...dest, matchScore: finalScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
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
                Smart Match Algorithm
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mb-6 leading-tight">
                Stop guessing.<br /> Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">experiencing.</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl mb-10">
                Tell us what kind of weekend you want, and our decision engine will calculate the perfect day trip from Yokohama.
              </p>
              <div className="flex gap-4 w-full md:w-auto">
                <Link to="/destinations" className="w-full md:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-12 px-8 text-base rounded-full bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
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
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors">
                      <SelectValue placeholder="Select vibe..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">
                        <div className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-slate-400" /> Anything goes</div>
                      </SelectItem>
                      <SelectItem value="couple">
                        <div className="flex items-center"><Heart className="w-4 h-4 mr-2 text-rose-500" /> Romantic Couple Trip</div>
                      </SelectItem>
                      <SelectItem value="food">
                        <div className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-orange-500" /> Food & Eating</div>
                      </SelectItem>
                      <SelectItem value="nature">
                        <div className="flex items-center"><Trees className="w-4 h-4 mr-2 text-emerald-500" /> Nature & Outdoors</div>
                      </SelectItem>
                      <SelectItem value="museum">
                        <div className="flex items-center"><Palette className="w-4 h-4 mr-2 text-purple-500" /> Museums & Art</div>
                      </SelectItem>
                      <SelectItem value="photography">
                        <div className="flex items-center"><Camera className="w-4 h-4 mr-2 text-blue-500" /> Photography</div>
                      </SelectItem>
                      <SelectItem value="roadtrip">
                        <div className="flex items-center"><Car className="w-4 h-4 mr-2 text-slate-500" /> Scenic Road Trip</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weather */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Weather condition?</label>
                  <Select value={weather} onValueChange={(val) => { if (val) setWeather(val); }}>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors">
                      <SelectValue placeholder="Select weather..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">
                        <div className="flex items-center"><Sun className="w-4 h-4 mr-2 text-amber-500" /> Perfect Weather</div>
                      </SelectItem>
                      <SelectItem value="rainy">
                        <div className="flex items-center"><CloudRain className="w-4 h-4 mr-2 text-blue-500" /> Looks like Rain (Indoor focus)</div>
                      </SelectItem>
                      <SelectItem value="summer">
                        <div className="flex items-center"><ThermometerSun className="w-4 h-4 mr-2 text-red-500" /> Scorching Hot (Summer focus)</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transport */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">How are you getting there?</label>
                  <Select value={transport} onValueChange={(val) => { if (val) setTransport(val); }}>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors">
                      <SelectValue placeholder="Select transport..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">
                        <div className="flex items-center"><MapIcon className="w-4 h-4 mr-2 text-slate-400" /> No preference</div>
                      </SelectItem>
                      <SelectItem value="train">
                        <div className="flex items-center"><Train className="w-4 h-4 mr-2 text-emerald-600" /> Train Only</div>
                      </SelectItem>
                      <SelectItem value="car">
                        <div className="flex items-center"><Car className="w-4 h-4 mr-2 text-slate-600" /> Driving a Car</div>
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
              <div key={dest.id} className="relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-black text-xl z-10 shadow-lg border-4 border-white dark:border-background">
                  #{index + 1}
                </div>
                <DestinationCard destination={dest} />
                <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-sm text-emerald-700 dark:text-emerald-400 font-medium flex justify-between items-center">
                  <span>Smart Match Score</span>
                  <span className="text-lg font-bold">{Math.max(0, Math.round(dest.matchScore))}%</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}
