import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { TripStoreProvider } from "./shared/hooks/useTripStore";
import Navbar from "./shared/components/layout/Navbar";
import Footer from "./shared/components/layout/Footer";
const Home = lazy(() => import("./features/home/Home"));
const Destinations = lazy(() => import("./features/destinations/Destinations"));
const Favorites = lazy(() => import("./features/favorites/Favorites"));
import { ErrorBoundary } from "./shared/components/layout/ErrorBoundary";

const DestinationDetails = lazy(
  () => import("./features/destinations/DestinationDetails"),
);
const Compare = lazy(() => import("./features/compare/Compare"));
const PrefectureChecklist = lazy(
  () => import("./features/map/PrefectureChecklist"),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <TripStoreProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="flex-grow">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route
                    path="/destinations/:id"
                    element={<DestinationDetails />}
                  />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route
                    path="/visited-map"
                    element={<PrefectureChecklist />}
                  />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </Router>
    </TripStoreProvider>
  );
}

export default App;
