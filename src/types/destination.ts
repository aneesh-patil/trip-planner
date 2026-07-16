export interface Destination {
  id: string;
  name: string;
  prefecture: string;
  region: string;
  categories: string[];
  heroImage: string;
  gallery: string[];
  description: string;
  trainAvailable: boolean;
  carRecommended: boolean;
  trainTimeMin: number;
  carTimeMin: number;
  totalTripHours: number;
  budgetMin: number;
  budgetRecommended: number;
  budgetMax: number;
  walkingMin: number;
  walkingSunMin: number;
  walkingShadeMin: number;
  indoorPercent: number;
  ratings: {
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
  };
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
  reservation: string;
  parking: string;
  highlights: string[];
  tags: string[];
  itinerary: {
    time: string;
    activity: string;
  }[];
  restaurants: string[];
  cafes: string[];
  notes: string;
}
