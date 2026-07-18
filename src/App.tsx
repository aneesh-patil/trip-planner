import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { TripStoreProvider } from "./hooks/useTripStore";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Favorites from "./pages/Favorites";

const DestinationDetails = lazy(() => import("./pages/DestinationDetails"));
const Compare = lazy(() => import("./pages/Compare"));
const JapanMap = lazy(() => import("./pages/JapanMap"));

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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:id" element={<DestinationDetails />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/map" element={<JapanMap />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </TripStoreProvider>
  );
}

export default App;
