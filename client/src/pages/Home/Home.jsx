import React, { useEffect, useState, useContext, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CardWrapper from "../../components/ui/CardWrapper/CardWrapper";
import { AuthContext } from "../../contexts/authContexts/authContexts";
import { useCity } from "../../contexts/cityContext/cityContext";

const Home = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { city } = useCity();

  const fetchRecommendations = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_HOST
        }/itinerary/recommendations?userId=${currentUser.uid}&cityId=${
          city.cityId
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data = await response.json();
      setActivityTypes(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }, [city, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.uid && city && city.cityId) {
      fetchRecommendations();
    }
  }, [currentUser, city, fetchRecommendations]);

  return (
    <div className="container-fluid mt-3">
      <h1 className="text-center display-2">{city.name.replace(/_/g, " ")}</h1>
      {activityTypes.map((activity, index) => (
        <CardWrapper key={index} activity={activity} />
      ))}
    </div>
  );
};

export default Home;
