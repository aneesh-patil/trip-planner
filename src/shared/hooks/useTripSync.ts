import { useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseTripSyncProps {
  user: User | null;
  favorites: string[];
  setFavorites: (val: string[] | ((prev: string[]) => string[])) => void;
  visited: string[];
  setVisited: (val: string[] | ((prev: string[]) => string[])) => void;
  visitedPrefectures: string[];
  setVisitedPrefectures: (
    val: string[] | ((prev: string[]) => string[]),
  ) => void;
  compareList: string[];
  setCompareList: (val: string[] | ((prev: string[]) => string[])) => void;
  homeStation: string;
  setHomeStation: (val: string | ((prev: string) => string)) => void;
  setHomeStationCoords: (
    val:
      | { lat: number; lng: number }
      | null
      | ((
          prev: { lat: number; lng: number } | null,
        ) => { lat: number; lng: number } | null),
  ) => void;
}

export function useTripSync({
  user,
  favorites,
  setFavorites,
  visited,
  setVisited,
  visitedPrefectures,
  setVisitedPrefectures,
  setCompareList,
  homeStation,
  setHomeStation,
  setHomeStationCoords,
}: UseTripSyncProps) {
  const isLoadedRef = useRef(false);
  const prevUserIdRef = useRef(user?.id);
  const syncTimeoutRef = useRef<number | ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Clear data on logout, reset load state on user change
  useEffect(() => {
    if (prevUserIdRef.current && !user?.id) {
      setFavorites([]);
      setVisited([]);
      setVisitedPrefectures([]);
      setCompareList([]);
      isLoadedRef.current = false;
    } else if (user?.id && user.id !== prevUserIdRef.current) {
      isLoadedRef.current = false;
    }
    prevUserIdRef.current = user?.id;
  }, [
    user?.id,
    setFavorites,
    setVisited,
    setVisitedPrefectures,
    setCompareList,
  ]);

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
            console.error("Failed to load user data", error);
            return;
          }
          if (data) {
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
                      (s: { name: string; lat: number; lng: number }) =>
                        s.name === stName,
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
}
