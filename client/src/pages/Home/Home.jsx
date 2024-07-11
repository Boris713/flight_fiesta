import { useEffect, useState, useContext } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CardWrapper from "../../components/ui/CardWrapper/CardWrapper";
import { AuthContext } from "../../contexts/authContexts/authContexts";

const Home = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const fetchRecommendations = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REACT_APP_HOST
            }/itinerary/recommendations?userId=${currentUser.uid}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch recommendations");
          }
          const data = await response.json();
          setActivityTypes(data.slice(0, 3));
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      };
      fetchRecommendations();
    }
  }, [currentUser]);

  return (
    <>
      <div className="container mt-5">
        {activityTypes.map((activity, index) => (
          <CardWrapper key={index} activity={activity} />
        ))}
      </div>
    </>
  );
};
export default Home;
