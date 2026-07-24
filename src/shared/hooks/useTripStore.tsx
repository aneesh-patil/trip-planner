import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTripSync } from "@/shared/hooks/useTripSync";
import destinationsIndex from "@/shared/data/destinations-index.json";
import type { Trip, TripStop } from "@/shared/types/trip";
import * as TripService from "@/shared/services/trips/TripService";
import { generateUUID } from "@/shared/utils/uuid";

interface TripStoreContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  visited: string[];
  toggleVisited: (id: string) => void;
  isVisited: (id: string) => boolean;

  visitedPrefectures: string[];
  isPrefectureVisited: (id: string) => boolean;

  homeStation: string;
  setHomeStation: (station: string) => void;

  homeStationCoords: { lat: number; lng: number } | null;
  setHomeStationCoords: (coords: { lat: number; lng: number } | null) => void;

  compareList: string[];
  toggleCompare: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;

  trips: Trip[];
  setTrips: (val: Trip[] | ((prev: Trip[]) => Trip[])) => void;
  addTrip: (title: string, startDate?: string, endDate?: string) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addStopToTrip: (tripId: string, stop: Omit<TripStop, "id">) => void;
  removeStopFromTrip: (tripId: string, stopId: string) => void;
  updateTripStop: (
    tripId: string,
    stopId: string,
    updates: Partial<TripStop>,
  ) => void;
  reorderTripStops: (
    tripId: string,
    startIndex: number,
    endIndex: number,
  ) => void;
}

const TripStoreContext = createContext<TripStoreContextType | undefined>(
  undefined,
);

export function TripStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "trip-planner-favorites",
    [],
  );
  const [visited, setVisited] = useLocalStorage<string[]>(
    "trip-planner-visited",
    [],
  );
  const [visitedPrefectures, setVisitedPrefectures] = useLocalStorage<string[]>(
    "trip-planner-visited-prefs",
    [],
  );
  // Note: compareList is intentionally kept local-only (stored in localStorage, not synced to cloud)
  const [compareList, setCompareList] = useLocalStorage<string[]>(
    "trip-planner-compare",
    [],
  );
  const [homeStation, setHomeStation] = useLocalStorage<string>(
    "trip-planner-home-station",
    "Tokyo Station",
  );
  const [homeStationCoords, setHomeStationCoords] = useLocalStorage<{
    lat: number;
    lng: number;
  } | null>(
    "trip-planner-home-station-coords",
    { lat: 35.6812, lng: 139.7671 }, // Tokyo Station default
  );

  const [trips, setTrips] = useLocalStorage<Trip[]>("trip-planner-trips", []);

  // Modular cloud persistence & initial load hook
  useTripSync({
    user,
    favorites,
    setFavorites,
    visited,
    setVisited,
    visitedPrefectures,
    setVisitedPrefectures,
    compareList,
    setCompareList,
    homeStation,
    setHomeStation,
    setHomeStationCoords,
    trips,
    setTrips,
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleVisited = (id: string) => {
    setVisited((prev) => {
      const isNowVisited = !prev.includes(id);

      const destination = destinationsIndex.find((d) => d.id === id);
      if (destination) {
        let prefId = destination.prefecture;
        if (prefId === "Hokkaido") prefId = "Hokkaido\x8D";

        if (isNowVisited) {
          setVisitedPrefectures((prevPrefs) =>
            prevPrefs.includes(prefId) ? prevPrefs : [...prevPrefs, prefId],
          );
        } else {
          const remainingVisitedIds = prev.filter((vId) => vId !== id);
          const hasOtherVisitedInPref = remainingVisitedIds.some((vId) => {
            const otherDest = destinationsIndex.find((d) => d.id === vId);
            if (!otherDest) return false;
            let otherPref = otherDest.prefecture;
            if (otherPref === "Hokkaido") otherPref = "Hokkaido\x8D";
            return otherPref === prefId;
          });

          if (!hasOtherVisitedInPref) {
            setVisitedPrefectures((prevPrefs) =>
              prevPrefs.filter((p) => p !== prefId),
            );
          }
        }
      }

      return isNowVisited ? [...prev, id] : prev.filter((vId) => vId !== id);
    });
  };

  const isVisited = (id: string) => visited.includes(id);

  const isPrefectureVisited = (id: string) => visitedPrefectures.includes(id);

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cId) => cId !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const isComparing = (id: string) => compareList.includes(id);

  const clearCompare = () => setCompareList([]);

  // Trip Management Actions
  const addTrip = (
    title: string,
    startDate?: string,
    endDate?: string,
  ): Trip => {
    const errors = TripService.validateTrip(title, startDate, endDate);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
    const newTrip: Trip = {
      id: generateUUID(),
      userId: user?.id || "guest",
      title,
      startDate,
      endDate,
      status: "draft",
      stops: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrips((prev) => [...prev, newTrip]);
    return newTrip;
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const addStopToTrip = (tripId: string, stop: Omit<TripStop, "id">) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? TripService.addStopToTrip(t, stop) : t,
      ),
    );
  };

  const removeStopFromTrip = (tripId: string, stopId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? TripService.removeStopFromTrip(t, stopId) : t,
      ),
    );
  };

  const updateTripStop = (
    tripId: string,
    stopId: string,
    updates: Partial<TripStop>,
  ) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? TripService.updateTripStop(t, stopId, updates) : t,
      ),
    );
  };

  const reorderTripStops = (
    tripId: string,
    startIndex: number,
    endIndex: number,
  ) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? TripService.reorderStops(t, startIndex, endIndex) : t,
      ),
    );
  };

  return (
    <TripStoreContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        visited,
        toggleVisited,
        isVisited,
        visitedPrefectures,
        isPrefectureVisited,
        compareList,
        toggleCompare,
        isComparing,
        clearCompare,
        homeStation,
        setHomeStation,
        homeStationCoords,
        setHomeStationCoords,
        trips,
        setTrips,
        addTrip,
        updateTrip,
        deleteTrip,
        addStopToTrip,
        removeStopFromTrip,
        updateTripStop,
        reorderTripStops,
      }}
    >
      {children}
    </TripStoreContext.Provider>
  );
}

export function useTripStore() {
  const context = useContext(TripStoreContext);
  if (context === undefined) {
    throw new Error("useTripStore must be used within a TripStoreProvider");
  }
  return context;
}
