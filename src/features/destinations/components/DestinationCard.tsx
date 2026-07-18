import { Link } from "react-router-dom";
import type { Destination } from "@/shared/types/destination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  MapPin,
  Train,
  TrainFront,
  Bus,
  Car,
  DollarSign,
  Bookmark,
  CheckCircle2,
  PlusSquare,
  CheckSquare,
  Sun,
} from "lucide-react";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { getAdjustedBudget } from "@/shared/utils/utils";

interface DestinationCardProps {
  destination: Destination;
  activeTransportMode?: string;
}

export default function DestinationCard({
  destination,
  activeTransportMode = "all",
}: DestinationCardProps) {
  const {
    isFavorite,
    toggleFavorite,
    isVisited,
    toggleVisited,
    isComparing,
    toggleCompare,
    compareList,
  } = useTripStore();
  const favorite = isFavorite(destination.id);
  const visited = isVisited(destination.id);
  const comparing = isComparing(destination.id);

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
            <Badge
              key={tag}
              className="bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20"
            >
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
            <Bookmark
              className={`w-5 h-5 ${favorite ? "fill-rose-500 text-rose-500" : ""}`}
            />
          </button>
          <button
            onClick={() => toggleVisited(destination.id)}
            className="p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full transition-colors shadow-sm text-slate-700"
            title="Mark as Visited"
          >
            <CheckCircle2
              className={`w-5 h-5 ${visited ? "fill-emerald-500 text-emerald-500" : ""}`}
            />
          </button>
        </div>
      </div>

      <CardHeader className="pb-2 pt-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight mb-1">
              {destination.name}
            </h3>
            <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              {destination.prefecture}
            </div>
          </div>
          <div className="flex items-center bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50 px-2.5 py-1 rounded-lg">
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              ⭐ {destination.ratings.overall}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5 flex-grow">
        {destination.matchScore ? (
          // SMART MATCH VIEW (Homepage Recommendation)
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Weekend Match
              </span>
              <span className="text-2xl font-black text-emerald-500">
                {Number(destination.matchScore).toFixed(1)}%
              </span>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Why you should go:
              </p>
              {destination.matchReasons?.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // STANDARD EXPLORE VIEW (Simple, elegant tags instead of raw numbers)
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center">
                {(() => {
                  const to = destination.transportOptions || {};
                  let mode = "train";
                  let time = 0;
                  if (
                    activeTransportMode !== "all" &&
                    to[activeTransportMode as keyof typeof to]
                  ) {
                    mode = activeTransportMode;
                    time = to[activeTransportMode as keyof typeof to]!;
                  } else {
                    const entries = Object.entries(to).filter(
                      ([_, v]) => v !== undefined,
                    ) as [string, number][];
                    if (entries.length > 0) {
                      const fastest = entries.reduce((min, curr) =>
                        curr[1] < min[1] ? curr : min,
                      );
                      mode = fastest[0];
                      time = fastest[1];
                    }
                  }

                  let Icon = Train;
                  if (mode === "car") Icon = Car;
                  if (mode === "bus") Icon = Bus;
                  if (mode === "shinkansen") Icon = TrainFront;

                  return (
                    <>
                      <Icon className="w-4 h-4 mr-2 text-slate-400" />
                      <span>{time > 0 ? `${time}m trip` : "N/A"}</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                <span>
                  ¥
                  {(
                    getAdjustedBudget(destination, activeTransportMode) / 1000
                  ).toFixed(0)}
                  k est.
                </span>
              </div>
              <div className="flex items-center">
                <Sun className="w-4 h-4 mr-2 text-slate-400" />
                <span>
                  {destination.walkingSunMin < 3000 ? "Low sun" : "High sun"}
                </span>
              </div>
              <div className="flex items-center">
                <Bookmark className="w-4 h-4 mr-2 text-slate-400" />
                <span>Couple {destination.ratings.couple}/10</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap gap-2">
                {destination.categories.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center gap-2">
        <Button
          variant={comparing ? "default" : "outline"}
          size="sm"
          className={
            comparing
              ? "bg-slate-900 hover:bg-slate-800 text-white w-1/2"
              : "w-1/2"
          }
          onClick={() => {
            if (!comparing && compareList.length >= 4) {
              alert("You can only compare up to 4 destinations at a time.");
              return;
            }
            toggleCompare(destination.id);
          }}
        >
          {comparing ? (
            <CheckSquare className="w-4 h-4 mr-1.5" />
          ) : (
            <PlusSquare className="w-4 h-4 mr-1.5 text-slate-400" />
          )}
          {comparing ? "Added" : "Compare"}
        </Button>
        <Link to={`/destinations/${destination.id}`} className="w-1/2">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold"
          >
            Explore
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
