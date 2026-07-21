import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "@/shared/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import destinationsIndex from "@/shared/data/destinations-index.json";
import { toast } from "sonner";

interface TripStoreContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  visited: string[];
  toggleVisited: (id: string) => void;
  isVisited: (id: string) => boolean;

  visitedPrefectures: string[];
  toggleVisitedPrefecture: (id: string) => void;
  isPrefectureVisited: (id: string) => boolean;

  homeStation: string;
  setHomeStation: (station: string) => void;

  homeStationCoords: { lat: number; lng: number } | null;
  setHomeStationCoords: (coords: { lat: number; lng: number } | null) => void;

  compareList: string[];
  toggleCompare: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
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
  const isLoadedRef = useRef(false);
  const prevUserIdRef = useRef(user?.id);
  const syncTimeoutRef = useRef<number | ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Clear data on logout, reset load state on user change
  useEffect(() => {
    if (prevUserIdRef.current && !user?.id) {
      // User logged out: wipe local data
      setFavorites([]);
      setVisited([]);
      setVisitedPrefectures([]);
      isLoadedRef.current = false;
    } else if (user?.id && user.id !== prevUserIdRef.current) {
      // User changed / logged in: reset load state so it fetches fresh data
      isLoadedRef.current = false;
    }
    prevUserIdRef.current = user?.id;
  }, [user?.id, setFavorites, setVisited]);

  // Fetch initial data on login
  useEffect(() => {
    if (user?.id && !isLoadedRef.current) {
      if (!supabase) return;
      supabase
        .from("user_data")
        .select("favorites, visited, visited_prefectures, home_station")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== "PGRST116") {
            // PGRST116 means 0 rows returned, which is normal for a brand new user
            console.error("Failed to load user data", error);
            return;
          }
          if (data) {
            // Overwrite local state with remote state (remote-wins on initial load)
            if (data.favorites) setFavorites(data.favorites);
            if (data.visited) setVisited(data.visited);
            if (data.visited_prefectures)
              setVisitedPrefectures(data.visited_prefectures);
            if (data.home_station && data.home_station !== "Tokyo Station") {
              setHomeStation(data.home_station);

              if (data.home_station.includes(", ")) {
                const [stName, pref] = data.home_station.split(", ");
                fetch("/data/stations-by-prefecture.json")
                  .then((r) => r.json())
                  .then((stationsMap) => {
                    const st = stationsMap[pref]?.find(
                      (s: any) => s.name === stName,
                    );
                    if (st) setHomeStationCoords({ lat: st.lat, lng: st.lng });
                  })
                  .catch(console.error);
              } else if (
                /^\d{3}-?\d{4}$/.test(data.home_station) ||
                /^\d+$/.test(data.home_station)
              ) {
                const cleanZip = data.home_station.replace("-", "");
                fetch(
                  `https://nominatim.openstreetmap.org/search?postalcode=${cleanZip}&country=japan&format=json`,
                )
                  .then((r) => r.json())
                  .then((d) => {
                    if (d && d.length > 0) {
                      setHomeStationCoords({
                        lat: parseFloat(d[0].lat),
                        lng: parseFloat(d[0].lon),
                      });
                    }
                  })
                  .catch(console.error);
              }
            }
          }
          // Defer setting isLoaded to true to avoid race condition with state updates
          setTimeout(() => {
            isLoadedRef.current = true;
          }, 0);
        });
    }
  }, [
    user?.id,
    setFavorites,
    setVisited,
    setVisitedPrefectures,
    setHomeStation,
    setHomeStationCoords,
  ]);

  // Sync back to db when state changes
  useEffect(() => {
    if (user?.id && isLoadedRef.current) {
      const client = supabase;
      if (!client) return;

      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      syncTimeoutRef.current = setTimeout(() => {
        client
          .from("user_data")
          .upsert({
            id: user.id,
            favorites,
            visited,
            visited_prefectures: visitedPrefectures,
            home_station: homeStation,
          })
          .then(({ error }) => {
            if (error) {
              console.error("Failed to sync user data", error);
              toast.error("Failed to sync to cloud. Saved locally.");
            }
          });
      }, 1000);
    }

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [favorites, visited, visitedPrefectures, homeStation, user?.id]);

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
          // Auto-check the prefecture
          setVisitedPrefectures((prevPrefs) =>
            prevPrefs.includes(prefId) ? prevPrefs : [...prevPrefs, prefId],
          );
        } else {
          // Smart un-check: only remove the prefecture if no OTHER visited destinations are in it
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

  const toggleVisitedPrefecture = (id: string) => {
    setVisitedPrefectures((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id],
    );
  };

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
        toggleVisitedPrefecture,
        isPrefectureVisited,
        compareList,
        toggleCompare,
        isComparing,
        clearCompare,
        homeStation,
        setHomeStation,
        homeStationCoords,
        setHomeStationCoords,
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
