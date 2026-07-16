import { useParams, Link } from "react-router-dom";
import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/types/destination";
import { ArrowLeft, MapPin, Clock, DollarSign, Footprints, ThermometerSun, Heart, Umbrella, Camera, Coffee, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function DestinationDetails() {
  const { id } = useParams();
  const destination = (destinationsData as Destination[]).find(d => d.id === id);

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
        <img src={destination.heroImage} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full container mx-auto px-4 pb-8 text-white">
          <Link to="/destinations" className="inline-flex items-center text-sm font-medium hover:text-emerald-400 transition-colors mb-4 text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-emerald-600 hover:bg-emerald-500 border-none">{destination.region}</Badge>
            {destination.categories.map(cat => (
              <Badge key={cat} variant="outline" className="text-white border-white/30 backdrop-blur-md bg-white/10">{cat}</Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">{destination.name}</h1>
          <div className="flex items-center text-lg text-slate-200">
            <MapPin className="w-5 h-5 mr-1" /> {destination.prefecture}, Japan
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Overview</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {destination.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">#{tag}</Badge>
                ))}
              </div>
            </section>

            <Tabs defaultValue="logistics" className="w-full">
              <TabsList className="w-full justify-start h-auto p-1 bg-white dark:bg-slate-900 border shadow-sm rounded-xl overflow-x-auto overflow-y-hidden">
                <TabsTrigger value="logistics" className="rounded-lg py-2.5 px-4">Logistics</TabsTrigger>
                <TabsTrigger value="ratings" className="rounded-lg py-2.5 px-4">Detailed Ratings</TabsTrigger>
                <TabsTrigger value="itinerary" className="rounded-lg py-2.5 px-4">Sample Itinerary</TabsTrigger>
                <TabsTrigger value="food" className="rounded-lg py-2.5 px-4">Food & Drink</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logistics" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600"><Clock className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Travel Time</h4>
                        <p className="text-sm text-slate-500 mt-1">Train: {destination.trainAvailable ? `${destination.trainTimeMin} min` : "N/A"}</p>
                        <p className="text-sm text-slate-500">Car: {destination.carTimeMin} min</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600"><DollarSign className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Budget (per person)</h4>
                        <p className="text-sm text-slate-500 mt-1">Min: ¥{destination.budgetMin.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">Recommended: ¥{destination.budgetRecommended.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600"><Footprints className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Walking Estimates</h4>
                        <p className="text-sm text-slate-500 mt-1">Total: {destination.walkingMin.toLocaleString()} steps</p>
                        <p className="text-sm text-slate-500">In Direct Sun: {destination.walkingSunMin.toLocaleString()} steps</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="ratings" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <RatingItem icon={Heart} label="Couple" value={destination.ratings.couple} />
                      <RatingItem icon={ThermometerSun} label="Summer" value={destination.ratings.summer} />
                      <RatingItem icon={Umbrella} label="Rain" value={destination.ratings.rain} />
                      <RatingItem icon={Camera} label="Photography" value={destination.ratings.photography} />
                      <RatingItem icon={Utensils} label="Food" value={destination.ratings.food} />
                      <RatingItem icon={DollarSign} label="Value" value={destination.ratings.value} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {destination.itinerary.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            {idx < destination.itinerary.length - 1 && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-1"></div>}
                          </div>
                          <div className="pb-4">
                            <div className="text-sm font-bold text-emerald-600">{step.time}</div>
                            <div className="text-slate-700 dark:text-slate-300 mt-1 font-medium">{step.activity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food" className="mt-4">
                <Card>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold flex items-center mb-3"><Utensils className="w-4 h-4 mr-2" /> Top Restaurants</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                        {destination.restaurants.map(r => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold flex items-center mb-3"><Coffee className="w-4 h-4 mr-2" /> Nice Cafes</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                        {destination.cafes.map(c => <li key={c}>{c}</li>)}
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
                <div className="text-5xl font-black mb-2">{destination.ratings.overall}</div>
                <div className="text-emerald-100 font-medium tracking-widest uppercase text-sm mb-4">Overall Score</div>
                <div className="w-full h-px bg-white/20 mb-4"></div>
                <p className="text-emerald-50 text-sm">
                  {destination.notes}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {destination.highlights.map(h => (
                    <li key={h} className="flex items-start">
                      <div className="min-w-6 min-h-6 bg-slate-100 dark:bg-slate-800 text-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reservation Info</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{destination.reservation}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Parking</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{destination.parking}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function RatingItem({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <Icon className="w-6 h-6 text-emerald-600 mb-2" />
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-xl font-bold text-slate-900 dark:text-white mt-1">{value}/10</span>
    </div>
  );
}
