import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContexts/authContexts";

const PrivateRoutes = () => {
  const { userLoggedIn, loading } = useAuth();

  console.log("Loading state:", loading); // Logging loading state
  console.log("User logged in state:", userLoggedIn); // Logging auth state

  if (loading) {
    // Optionally, you can return a loading spinner here
    return <div>Loading...</div>;
  }

  return userLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
