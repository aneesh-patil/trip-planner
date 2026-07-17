import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';

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

const TripStoreContext = createContext<TripStoreContextType | undefined>(undefined);

export function TripStoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('trip-planner-favorites', []);
  const [visited, setVisited] = useLocalStorage<string[]>('trip-planner-visited', []);
  const [compareList, setCompareList] = useLocalStorage<string[]>('trip-planner-compare', []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleVisited = (id: string) => {
    setVisited(prev => 
      prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
    );
  };

  const isVisited = (id: string) => visited.includes(id);

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(cId => cId !== id);
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

  // Cloud Sync Logic
  const [isCloudSyncing, setIsCloudSyncing] = useState(true);

  // 1. Initial Load from Cloud
  useEffect(() => {
    fetch("/api/sync")
      .then(res => res.json())
      .then(data => {
        if (data.favorites && Array.isArray(data.favorites)) setFavorites(data.favorites);
        if (data.visited && Array.isArray(data.visited)) setVisited(data.visited);
      })
      .catch(err => console.error("Cloud sync failed (are you running the worker?)", err))
      .finally(() => setIsCloudSyncing(false));
  }, []);

  // 2. Save to Cloud on Change
  useEffect(() => {
    if (isCloudSyncing) return; // Don't push during initial load
    
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorites, visited })
    }).catch(err => console.error("Failed to push to cloud", err));
  }, [favorites, visited, isCloudSyncing]);

  return (
    <TripStoreContext.Provider value={{
      favorites, toggleFavorite, isFavorite,
      visited, toggleVisited, isVisited,
      compareList, toggleCompare, isComparing, clearCompare,
      exportData, importData
    }}>
      {children}
    </TripStoreContext.Provider>
  );
}

export function useTripStore() {
  const context = useContext(TripStoreContext);
  if (context === undefined) {
    throw new Error('useTripStore must be used within a TripStoreProvider');
  }
  return context;
}
