import React from "react";
import { useLocation } from "react-router-dom";
import Nav from "./Nav";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../contexts/authContexts/authContexts";

const Header = () => {
  const { userLoggedIn, logout } = useAuth();
  const location = useLocation();

  const isLoginRoute = location.pathname === "/";

  return (
    <>
      <h1 className="d-flex justify-content-center bg-primary text-white">
        FlightFiesta
      </h1>
      {userLoggedIn && !isLoginRoute && (
        <>
          <Nav />
          <div className="d-flex justify-content-end p-3">
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
