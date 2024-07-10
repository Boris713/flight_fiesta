import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Authentication from "./pages/Authentication/Authentication";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContexts/authContexts";
import { CityProvider } from "./contexts/cityContext/cityContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CityProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Authentication />}></Route>
            <Route path="/home" element={<Home />}></Route>
          </Routes>
        </CityProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
