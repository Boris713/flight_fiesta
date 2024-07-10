import React from "react";
import { useLocation } from "react-router-dom";
import Nav from "./Nav";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../contexts/authContexts/authContexts";

const Header = () => {
  const { userLoggedIn } = useAuth();
  const location = useLocation();

  const isLoginRoute = location.pathname === "/";

  return (
    <>
      <h1 className="d-flex justify-content-center bg-primary text-white">
        FlightFiesta
      </h1>
      {userLoggedIn && !isLoginRoute && <Nav />}
    </>
  );
};

export default Header;
