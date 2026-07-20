import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useUser } from "@clerk/clerk-react";

interface TripStoreContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  visited: string[];
  toggleVisited: (id: string) => void;
  isVisited: (id: string) => boolean;

  compareList: string[];
  toggleCompare: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;

  exportData: () => string;
  importData: (encodedData: string) => boolean;
}

const TripStoreContext = createContext<TripStoreContextType | undefined>(
  undefined,
);

export function TripStoreProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser();
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "trip-planner-favorites",
    [],
  );
  const [visited, setVisited] = useLocalStorage<string[]>(
    "trip-planner-visited",
    [],
  );
  const [compareList, setCompareList] = useLocalStorage<string[]>(
    "trip-planner-compare",
    [],
  );
  const isLoadedRef = useRef(false);

  // Fetch initial data on login
  useEffect(() => {
    if (isSignedIn && user?.id && !isLoadedRef.current) {
      fetch(`/api/sync?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.favorites) setFavorites(data.favorites);
          if (data.visited) setVisited(data.visited);
          isLoadedRef.current = true;
        })
        .catch((err) => console.error("Failed to load user data", err));
    }
  }, [isSignedIn, user?.id, setFavorites, setVisited]);

  // Sync back to db when state changes
  useEffect(() => {
    if (isSignedIn && user?.id && isLoadedRef.current) {
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          favorites,
          visited,
        }),
      }).catch((err) => console.error("Failed to sync user data", err));
    }
  }, [favorites, visited, isSignedIn, user?.id]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleVisited = (id: string) => {
    setVisited((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id],
    );
  };

  const isVisited = (id: string) => visited.includes(id);

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

  const exportData = () => {
    const data = { favorites, visited };
    return btoa(JSON.stringify(data)); // Base64 encode
  };

  const importData = (encodedData: string) => {
    try {
      const decoded = atob(encodedData);
      const data = JSON.parse(decoded);
      if (data.favorites && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }
      if (data.visited && Array.isArray(data.visited)) {
        setVisited(data.visited);
      }
      return true;
    } catch (e) {
      console.error("Failed to import data", e);
      return false;
    }
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
        compareList,
        toggleCompare,
        isComparing,
        clearCompare,
        exportData,
        importData,
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
