export interface ItineraryStep {
  time: string;
  activity: string;
}

export interface ItineraryPlan {
  name: string;
  description: string;
  steps: ItineraryStep[];
}

export interface Ratings {
  overall: number;
  couple: number;
  summer: number;
  winter: number;
  rain: number;
  food: number;
  photography: number;
  relaxation: number;
  value: number;
  uniqueness: number;
}

export interface Destination {
  id: string;
  name: string;
  prefecture: string;
  region: string;
  categories: string[];
  heroImage: string;
  gallery: string[];
  description: string;
  highlights: string[];
  budgetRecommended: number;
  budgetMin: number;
  budgetMax: number;
  trainAvailable: boolean;
  carRecommended: boolean;
  trainTimeMin: number;
  carTimeMin: number;
  totalTripHours: number;
  walkingMin: number;
  walkingSunMin: number;
  walkingShadeMin: number;
  indoorPercent: number;
  coordinates?: { lat: number; lng: number };
  ratings: Ratings;
  crowd: {
    weekday: number;
    weekend: number;
    holiday: number;
  };
  season: {
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
  };
  bestMonths: number[];
  bestSeason?: string;
  weatherDependence?: string;
  tags: string[];
  reservation: string;
  parking: string;
  restaurants: string[];
  cafes: string[];
  notes: string;
  lat: number;
  lng: number;
  itinerary?: ItineraryStep[];
  itineraries?: ItineraryPlan[];
}
