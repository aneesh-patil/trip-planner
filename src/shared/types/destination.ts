import type { CollectionMembership } from "./collection";

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
  budgetBreakdown?: {
    transport: number;
    tickets: number;
    food: number;
    cafe: number;
  };
  transportOptions: {
    train?: number;
    car?: number;
    my_car?: number;
    shinkansen?: number;
    bus?: number;
  };
  /** Optional: Explicit one-way route fares per person (or per car) */
  transportFares?: {
    train?: number;
    car?: number;
    my_car?: number;
    shinkansen?: number;
    bus?: number;
  };
  totalTripHours: number;
  walkingMin: number;
  walkingSunMin: number;
  walkingShadeMin: number;
  indoorPercent: number;
  coordinates?: { lat: number; lng: number };
  comfort?: {
    heatTolerance: number;
    rainFriendly: number;
    walkingIntensity: number;
  };
  ratings: Ratings;
  matchScore?: number;
  matchReasons?: string[];
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
  itinerary?: ItineraryStep[];
  itineraries?: ItineraryPlan[];

  /** Mandatory: Destination content quality status */
  status: "verified" | "planned";

  /** Mandatory: Travel estimate calibration confidence level */
  travelEstimate: {
    confidence: "high" | "medium" | "beta";
  };

  /** Mandatory: Curated collection memberships */
  collections: CollectionMembership[];
}
