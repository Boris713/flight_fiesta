import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Authentication from "./pages/Authentication/Authentication";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import ItineraryCreator from "./pages/ItineraryCreator/ItineraryCreator";
import Liked from "./pages/liked/liked";
import PastItineraries from "./pages/PastItineraries/PastItineraries";
import { CityProvider } from "./contexts/cityContext/cityContext";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";

function App() {
  return (
    <Router>
      <CityProvider>
        <Header />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/itinerary-creator" element={<ItineraryCreator />} />
            <Route
              path="/past-itineraries"
              element={<PastItineraries />}
            />{" "}
            <Route path="/liked" element={<Liked />} />
          </Route>
          <Route path="/" element={<Authentication />} />
        </Routes>
      </CityProvider>
    </Router>
  );
}

export default App;
