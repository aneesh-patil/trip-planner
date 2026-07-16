import { Link } from "react-router-dom";
import type { Destination } from "@/types/destination";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Train, Car, Clock, DollarSign, Heart, ThermometerSun, Footprints, PlusSquare, CheckSquare } from "lucide-react";
import { useTripStore } from "@/hooks/useTripStore";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { isFavorite, toggleFavorite, isComparing, toggleCompare, compareList } = useTripStore();
  const favorite = isFavorite(destination.id);
  const comparing = isComparing(destination.id);

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-sm hover:bg-white/100">
            {destination.region}
          </Badge>
          {destination.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} className="bg-emerald-600/90 hover:bg-emerald-600 text-white backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        <button 
          onClick={() => toggleFavorite(destination.id)}
          className="absolute top-3 right-3 p-2 bg-white/50 hover:bg-white/90 backdrop-blur-sm rounded-full transition-colors"
        >
          <Heart className={`w-5 h-5 ${favorite ? "fill-rose-500 text-rose-500" : "text-slate-700"}`} />
        </button>
      </div>

      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold leading-none mb-1">{destination.name}</h3>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 mr-1" />
              {destination.prefecture}
            </div>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{destination.ratings.overall}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow text-sm text-slate-600 dark:text-slate-300">
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {/* Transport */}
          <div className="flex items-center gap-1.5" title="Travel Time">
            {destination.trainAvailable ? <Train className="w-4 h-4 text-emerald-600" /> : <Car className="w-4 h-4 text-emerald-600" />}
            <span>{destination.trainAvailable ? destination.trainTimeMin : destination.carTimeMin} min</span>
          </div>
          
          {/* Budget */}
          <div className="flex items-center gap-1.5" title="Recommended Budget">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>¥{(destination.budgetRecommended / 1000).toFixed(0)}k</span>
          </div>
          
          {/* Walking */}
          <div className="flex items-center gap-1.5" title="Walking Required">
            <Footprints className="w-4 h-4 text-emerald-600" />
            <span>{(destination.walkingMin / 1000).toFixed(1)}k steps</span>
          </div>
          
          {/* Summer / Sun */}
          <div className="flex items-center gap-1.5" title="Summer Comfort">
            <ThermometerSun className="w-4 h-4 text-amber-500" />
            <span>{destination.ratings.summer}/10</span>
          </div>
          
          {/* Couple */}
          <div className="flex items-center gap-1.5" title="Couple Rating">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{destination.ratings.couple}/10</span>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-1.5" title="Total Trip Duration">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{destination.totalTripHours} hrs</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-slate-100 dark:border-slate-800 mt-auto pt-4 flex justify-between items-center gap-2">
        <Button 
          variant={comparing ? "default" : "outline"}
          size="sm"
          className={comparing ? "bg-emerald-600 hover:bg-emerald-700" : "flex-1 hover:bg-slate-100 dark:hover:bg-slate-800"}
          onClick={() => {
            if (!comparing && compareList.length >= 4) {
              alert("You can only compare up to 4 destinations at a time.");
              return;
            }
            toggleCompare(destination.id);
          }}
        >
          {comparing ? <CheckSquare className="w-4 h-4 mr-1" /> : <PlusSquare className="w-4 h-4 mr-1" />}
          {comparing ? "Added" : "Compare"}
        </Button>
        <Link to={`/destinations/${destination.id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
