import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TripStoreProvider } from "./hooks/useTripStore";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import Compare from "./pages/Compare";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <TripStoreProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TripStoreProvider>
  );
}

export default App;
