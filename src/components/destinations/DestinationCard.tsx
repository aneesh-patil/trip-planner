import { Link } from "react-router-dom";
import type { Destination } from "@/types/destination";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Train, Car, DollarSign, Bookmark, CheckCircle2, ThermometerSun, PlusSquare, CheckSquare, CloudRain, Utensils, Camera, Palette, Trees, Sun } from "lucide-react";
import { useTripStore } from "@/hooks/useTripStore";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { isFavorite, toggleFavorite, isVisited, toggleVisited, isComparing, toggleCompare, compareList } = useTripStore();
  const favorite = isFavorite(destination.id);
  const visited = isVisited(destination.id);
  const comparing = isComparing(destination.id);

  const getPerfectFor = (dest: Destination) => {
    const perfectFor = [];
    if (dest.ratings.summer >= 9) perfectFor.push({ icon: ThermometerSun, text: "Hot days", color: "text-amber-500" });
    if (dest.ratings.couple >= 9) perfectFor.push({ icon: Bookmark, text: "Couples", color: "text-rose-500" });
    if (dest.indoorPercent >= 0.7) perfectFor.push({ icon: CloudRain, text: "Rainy days", color: "text-blue-500" });
    if (dest.ratings.food >= 9) perfectFor.push({ icon: Utensils, text: "Foodies", color: "text-orange-500" });
    if (dest.ratings.photography >= 9) perfectFor.push({ icon: Camera, text: "Photography", color: "text-purple-500" });
    
    // Fill in gaps with categories if needed
    if (perfectFor.length < 3 && dest.categories.includes("Art")) perfectFor.push({ icon: Palette, text: "Culture", color: "text-indigo-500" });
    if (perfectFor.length < 3 && (dest.categories.includes("Mountain") || dest.categories.includes("Coast"))) perfectFor.push({ icon: Trees, text: "Nature", color: "text-emerald-500" });
    
    return perfectFor.slice(0, 3);
  };

  const perfectForTags = getPerfectFor(destination);

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${visited ? "grayscale opacity-80" : ""}`}
        />
        {visited && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <Badge className="bg-emerald-500/90 text-white text-sm py-1.5 px-3 border-none shadow-lg">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Already Visited
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-10">
          {destination.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} className="bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button 
            onClick={() => toggleFavorite(destination.id)}
            className="p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full transition-colors shadow-sm text-slate-700"
            title="Want to Visit"
          >
            <Bookmark className={`w-5 h-5 ${favorite ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
          <button 
            onClick={() => toggleVisited(destination.id)}
            className="p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full transition-colors shadow-sm text-slate-700"
            title="Mark as Visited"
          >
            <CheckCircle2 className={`w-5 h-5 ${visited ? "fill-emerald-500 text-emerald-500" : ""}`} />
          </button>
        </div>
      </div>

      <CardHeader className="pb-2 pt-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight mb-1">{destination.name}</h3>
            <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              {destination.prefecture}
            </div>
          </div>
          <div className="flex items-center bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50 px-2.5 py-1 rounded-lg">
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">⭐ {destination.ratings.overall}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5 flex-grow">
        {/* Core Metrics */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 text-sm font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            {destination.trainAvailable ? <Train className="w-4 h-4 text-slate-400" /> : <Car className="w-4 h-4 text-slate-400" />}
            <span>{destination.trainAvailable ? destination.trainTimeMin : destination.carTimeMin} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span>¥{(destination.budgetRecommended / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{(destination.walkingSunMin / 1000).toFixed(1)}k steps sun</span>
          </div>
        </div>

        {/* Perfect For Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Perfect for</p>
          <div className="space-y-2.5">
            {perfectForTags.map((tag, i) => (
              <div key={i} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
                <tag.icon className={`w-4 h-4 mr-2.5 ${tag.color}`} />
                {tag.text}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center gap-2">
        <Button 
          variant={comparing ? "default" : "outline"}
          size="sm"
          className={comparing ? "bg-slate-900 hover:bg-slate-800 text-white w-1/2" : "w-1/2"}
          onClick={() => {
            if (!comparing && compareList.length >= 4) {
              alert("You can only compare up to 4 destinations at a time.");
              return;
            }
            toggleCompare(destination.id);
          }}
        >
          {comparing ? <CheckSquare className="w-4 h-4 mr-1.5" /> : <PlusSquare className="w-4 h-4 mr-1.5 text-slate-400" />}
          {comparing ? "Added" : "Compare"}
        </Button>
        <Link to={`/destinations/${destination.id}`} className="w-1/2">
          <Button variant="default" size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold">
            Explore
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
