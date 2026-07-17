import { createContext, useContext } from 'react';
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

  return (
    <TripStoreContext.Provider value={{
      favorites, toggleFavorite, isFavorite,
      visited, toggleVisited, isVisited,
      compareList, toggleCompare, isComparing, clearCompare
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
