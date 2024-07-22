import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContexts/authContexts";

const PrivateRoutes = () => {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return userLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
