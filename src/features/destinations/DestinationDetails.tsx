import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { destinationService } from "@/shared/services/destination/DestinationService";
import type { Destination } from "@/shared/types/destination";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  ThermometerSun,
  Heart,
  Umbrella,
  Camera,
  Coffee,
  Utensils,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Train,
  TrainFront,
  Bus,
  Car,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  useWeekendWeather,
  getWeatherDescription,
} from "@/shared/hooks/useWeather";
import { budgetService } from "@/shared/services/budget/BudgetService";
import {
  getDistance,
  getDynamicTransportOptions,
} from "@/shared/utils/distance";

function WeatherIcon({ type }: { type: string }) {
  if (type === "sun") return <Sun className="w-6 h-6 text-amber-500" />;
  if (type === "cloud") return <Cloud className="w-6 h-6 text-slate-400" />;
  if (type === "rain") return <CloudRain className="w-6 h-6 text-blue-500" />;
  if (type === "snow") return <CloudSnow className="w-6 h-6 text-sky-300" />;
  if (type === "storm")
    return <CloudLightning className="w-6 h-6 text-indigo-600" />;
  return <Sun className="w-6 h-6 text-amber-500" />;
}

export default function DestinationDetails() {
  const { id } = useParams();
  const {
    isFavorite,
    toggleFavorite,
    isVisited,
    toggleVisited,
    homeStation,
    homeStationCoords,
  } = useTripStore();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [destLoading, setDestLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setDestLoading(true);
      destinationService
        .getDestination(id)
        .then((destObj: Destination | null) => {
          if (!destObj) {
            setDestination(null);
            setDestLoading(false);
            return;
          }
          const dest = { ...destObj };
          if (
            homeStationCoords &&
            dest.coordinates?.lat &&
            dest.coordinates?.lng
          ) {
            const distKm = getDistance(
              homeStationCoords.lat,
              homeStationCoords.lng,
              dest.coordinates.lat,
              dest.coordinates.lng,
            );
            dest.transportOptions = getDynamicTransportOptions(distKm);
          }
          setDestination(dest);
          setDestLoading(false);
        });
    }
  }, [id, homeStationCoords]);

  const { forecast, loading } = useWeekendWeather(
    destination?.coordinates?.lat,
    destination?.coordinates?.lng,
  );

  const defaultMode = useMemo(() => {
    if (!destination?.transportOptions) return "train";
    const entries = Object.entries(destination.transportOptions).filter(
      ([_, v]) => v !== undefined,
    ) as [string, number][];
    if (entries.length === 0) return "train";
    return entries.reduce((min, curr) => (curr[1] < min[1] ? curr : min))[0];
  }, [destination]);

  const [selectedTransportState, setSelectedTransport] = useState<
    string | null
  >(null);
  const selectedTransport =
    selectedTransportState &&
    destination?.transportOptions &&
    destination.transportOptions[
      selectedTransportState as keyof typeof destination.transportOptions
    ] !== undefined
      ? selectedTransportState
      : defaultMode;

  if (destLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-emerald-500 animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Destination Not Found</h1>
        <Link to="/destinations">
          <Button>Back to Destinations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-background min-h-screen pb-20">
      {/* Hero Image Header */}
      <div className="relative h-64 md:h-96 w-full">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full container mx-auto px-4 pb-8 text-white">
          <Link
            to="/destinations"
            className="inline-flex items-center text-sm font-medium hover:text-emerald-400 transition-colors mb-4 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-emerald-600 hover:bg-emerald-500 border-none">
              {destination.region}
            </Badge>
            {destination.categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-white border-white/30 backdrop-blur-md bg-white/10"
              >
                {cat}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
            {destination.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-lg text-slate-200 mt-2">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-1" /> {destination.prefecture},
              Japan
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(homeStation)}&destination=${encodeURIComponent(destination.name + ", " + destination.prefecture + ", Japan")}&travelmode=transit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4 mr-1.5" />
              Get Directions
            </a>

            <button
              onClick={() => toggleFavorite(destination.id)}
              className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isFavorite(destination.id)
                  ? "bg-rose-500 text-white hover:bg-rose-600 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/30"
              }`}
            >
              <Heart
                className={`w-4 h-4 mr-1.5 ${isFavorite(destination.id) ? "fill-current" : ""}`}
              />
              {isFavorite(destination.id) ? "On Bucket List" : "Want to visit"}
            </button>

            <button
              onClick={() => toggleVisited(destination.id)}
              className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isVisited(destination.id)
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/30"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {isVisited(destination.id) ? "Visited" : "Mark as Visited"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">
                Overview
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {destination.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>

            <Tabs defaultValue="logistics" className="w-full">
              <TabsList className="w-full justify-start h-auto p-1 bg-white dark:bg-slate-900 border shadow-sm rounded-xl overflow-x-auto overflow-y-hidden">
                <TabsTrigger
                  value="logistics"
                  className="rounded-lg py-2.5 px-4"
                >
                  Logistics
                </TabsTrigger>
                <TabsTrigger value="ratings" className="rounded-lg py-2.5 px-4">
                  Detailed Ratings
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="rounded-lg py-2.5 px-4"
                >
                  Sample Itinerary
                </TabsTrigger>
                <TabsTrigger value="food" className="rounded-lg py-2.5 px-4">
                  Food & Drink
                </TabsTrigger>
              </TabsList>

              <TabsContent value="logistics" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-full text-emerald-600">
                          <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          Travel Time
                        </h4>
                      </div>
                      <div className="space-y-2 flex-grow">
                        {destination.transportOptions?.train && (
                          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500 flex items-center">
                              <Train className="w-4 h-4 mr-1.5" /> Train
                            </span>
                            <div className="text-right">
                              <div className="font-semibold text-slate-700 dark:text-slate-300">
                                {destination.transportOptions.train}m
                              </div>
                              <div className="text-xs text-slate-400">
                                est. ¥
                                {(
                                  budgetService.getTransportCost(
                                    destination,
                                    "train",
                                  ) / 1000
                                ).toFixed(1)}
                                k
                              </div>
                            </div>
                          </div>
                        )}
                        {destination.transportOptions?.shinkansen && (
                          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500 flex items-center">
                              <TrainFront className="w-4 h-4 mr-1.5" />{" "}
                              Shinkansen
                            </span>
                            <div className="text-right">
                              <div className="font-semibold text-slate-700 dark:text-slate-300">
                                {destination.transportOptions.shinkansen}m
                              </div>
                              <div className="text-xs text-slate-400">
                                est. ¥
                                {(
                                  budgetService.getTransportCost(
                                    destination,
                                    "shinkansen",
                                  ) / 1000
                                ).toFixed(1)}
                                k
                              </div>
                            </div>
                          </div>
                        )}
                        {destination.transportOptions?.bus && (
                          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500 flex items-center">
                              <Bus className="w-4 h-4 mr-1.5" /> Bus
                            </span>
                            <div className="text-right">
                              <div className="font-semibold text-slate-700 dark:text-slate-300">
                                {destination.transportOptions.bus}m
                              </div>
                              <div className="text-xs text-slate-400">
                                est. ¥
                                {(
                                  budgetService.getTransportCost(
                                    destination,
                                    "bus",
                                  ) / 1000
                                ).toFixed(1)}
                                k
                              </div>
                            </div>
                          </div>
                        )}
                        {destination.transportOptions?.car && (
                          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500 flex items-center">
                              <Car className="w-4 h-4 mr-1.5" /> Car
                            </span>
                            <div className="text-right">
                              <div className="font-semibold text-slate-700 dark:text-slate-300">
                                {destination.transportOptions.car}m
                              </div>
                              <div className="text-xs text-slate-400">
                                est. ¥
                                {(
                                  budgetService.getTransportCost(
                                    destination,
                                    "car",
                                  ) / 1000
                                ).toFixed(1)}
                                k
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">👣 Walk</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            ~{(destination.walkingMin / 1000).toFixed(1)}k steps
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-full text-emerald-600">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                            Couple Budget
                          </h4>
                          <div className="text-emerald-600 font-black text-lg">
                            ¥
                            {budgetService
                              .getAdjustedBudget(destination, selectedTransport)
                              .toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {destination.transportOptions &&
                        Object.keys(destination.transportOptions).length >
                          1 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {Object.keys(destination.transportOptions).map(
                              (mode) => {
                                const isSelected = selectedTransport === mode;
                                const names: Record<string, string> = {
                                  train: "Train",
                                  shinkansen: "Shinkansen",
                                  car: "Car",
                                  bus: "Bus",
                                };
                                return (
                                  <button
                                    key={mode}
                                    onClick={() => setSelectedTransport(mode)}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                      isSelected
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {names[mode]}
                                  </button>
                                );
                              },
                            )}
                          </div>
                        )}

                      {destination.budgetBreakdown && (
                        <div className="space-y-2 mt-auto">
                          <div className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-1.5 mt-1.5 first:mt-0">
                            <span className="text-slate-500">
                              {
                                (
                                  {
                                    train: "🚆 Local Train",
                                    shinkansen: "🚄 Shinkansen",
                                    car: "🚗 Car & Tolls",
                                    bus: "🚌 Highway Bus",
                                  } as Record<string, string>
                                )[selectedTransport]
                              }
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              ¥
                              {budgetService
                                .getTransportCost(
                                  destination,
                                  selectedTransport,
                                )
                                .toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-1.5 mt-1.5">
                            <span className="text-slate-500">🎟 Tickets</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              ¥
                              {destination.budgetBreakdown.tickets.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-1.5">
                            <span className="text-slate-500">
                              🍜 Food & Cafe
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              ¥
                              {(
                                destination.budgetBreakdown.food +
                                destination.budgetBreakdown.cafe
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {destination.comfort && (
                    <Card>
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-full text-emerald-600">
                            <ThermometerSun className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            Comfort Metrics
                          </h4>
                        </div>
                        <div className="space-y-2 flex-grow">
                          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500">
                              ☀️ Heat Tolerance
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {destination.comfort.heatTolerance}/10
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500">
                              ☔ Rain Friendly
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {destination.comfort.rainFriendly}/10
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">
                              🚶 Walk Intensity
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {destination.comfort.walkingIntensity}/10
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ratings" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <RatingItem
                        icon={Heart}
                        label="Couple"
                        value={destination.ratings.couple}
                      />
                      <RatingItem
                        icon={ThermometerSun}
                        label="Summer"
                        value={destination.ratings.summer}
                      />
                      <RatingItem
                        icon={Umbrella}
                        label="Rain"
                        value={destination.ratings.rain}
                      />
                      <RatingItem
                        icon={Camera}
                        label="Photography"
                        value={destination.ratings.photography}
                      />
                      <RatingItem
                        icon={Utensils}
                        label="Food"
                        value={destination.ratings.food}
                      />
                      <RatingItem
                        icon={DollarSign}
                        label="Value"
                        value={destination.ratings.value}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6 space-y-8">
                {destination.itineraries && destination.itineraries.length > 0
                  ? destination.itineraries.map((plan, planIdx) => (
                      <div
                        key={planIdx}
                        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800"
                      >
                        <h3 className="text-xl font-bold mb-2 text-emerald-600 dark:text-emerald-400">
                          {plan.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                          {plan.description}
                        </p>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                          {plan.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                {idx + 1}
                              </div>
                              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-900 dark:text-slate-100">
                                    {step.time}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {step.activity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  : null}
              </TabsContent>

              <TabsContent value="food" className="mt-4">
                <Card>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold flex items-center mb-3">
                        <Utensils className="w-4 h-4 mr-2" /> Top Restaurants
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                        {(destination.restaurants ?? []).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold flex items-center mb-3">
                        <Coffee className="w-4 h-4 mr-2" /> Nice Cafes
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                        {(destination.cafes ?? []).map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-emerald-600 text-white border-none shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="text-5xl font-black mb-2">
                  {destination.ratings.overall}
                </div>
                <div className="text-emerald-100 font-medium tracking-widest uppercase text-sm mb-4">
                  Overall Score
                </div>
                <div className="w-full h-px bg-white/20 mb-4"></div>
                <p className="text-emerald-50 text-sm">{destination.notes}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {(destination.highlights ?? []).map((h) => (
                    <li key={h} className="flex items-start">
                      <div className="min-w-6 min-h-6 bg-slate-100 dark:bg-slate-800 text-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm leading-tight">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Upcoming Weekend Weather</h3>
                {loading || !forecast ? (
                  <div className="text-sm text-slate-500 animate-pulse flex items-center">
                    <ThermometerSun className="w-4 h-4 mr-2" /> Fetching
                    forecast...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forecast.map((day, idx) => {
                      const dateObj = new Date(day.date);
                      const dayName =
                        dateObj.getDay() === 6 ? "Saturday" : "Sunday";
                      const desc = getWeatherDescription(day.weatherCode);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                              <WeatherIcon type={desc.icon} />
                            </div>
                            <div>
                              <div className="text-sm font-bold">{dayName}</div>
                              <div className="text-xs text-slate-500">
                                {desc.text}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {day.maxTemp}°
                            </div>
                            <div className="text-xs font-medium text-slate-400">
                              {day.minTemp}°
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                {destination.reservation && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Reservation Info
                    </h4>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {destination.reservation}
                    </p>
                  </div>
                )}
                {destination.parking && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Parking
                    </h4>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {destination.parking}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <Icon className="w-6 h-6 text-emerald-600 mb-2" />
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-xl font-bold text-slate-900 dark:text-white mt-1">
        {value}/10
      </span>
    </div>
  );
}
