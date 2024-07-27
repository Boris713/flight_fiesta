import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../contexts/authContexts/authContexts";
import Card from "../../components/ui/Card/Card";

const Liked = () => {
  const [likedActivities, setLikedActivities] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchLikedActivities();
    }
  }, [currentUser]);

  const fetchLikedActivities = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_HOST
        }/itinerary/liked-activities?userId=${currentUser.uid}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch liked activities");
      }

      const data = await response.json();
      setLikedActivities(data);
    } catch (error) {
      console.error("Error fetching liked activities:", error);
    }
  };

  const handleRemoveActivity = (xid) => {
    setLikedActivities((prevActivities) =>
      prevActivities.filter((activity) => activity.xid !== xid)
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liked Activities</h1>
      <div className="row">
        {likedActivities.length > 0 ? (
          likedActivities.map((activity, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch"
              key={index}
            >
              <Card activityInfo={activity} onRemove={handleRemoveActivity} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No liked activities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;
