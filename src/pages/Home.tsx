import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import DestinationCard from "@/components/destinations/DestinationCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuredDestinations = (destinationsData as Destination[]).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold mb-6 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Your weekend decision engine
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6">
            Stop planning.<br /> Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">experiencing.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10">
            Compare destinations around Tokyo based on budget, weather, walking distance, and vibe to find your perfect weekend trip.
          </p>
          <div className="flex gap-4">
            <Link to="/destinations">
              <Button size="lg" className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                Find a Destination
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
                Compare Options
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Destinations</h2>
              <p className="text-slate-500 dark:text-slate-400">Hand-picked spots for this weekend.</p>
            </div>
            <Link to="/destinations" className="hidden sm:flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link to="/destinations">
              <Button variant="outline" className="w-full">
                View all destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
