import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CardWrapper.css";
import { useCity } from "../../../contexts/cityContext/cityContext";
import Card from "../Card/Card";
import { useEffect, useState } from "react";

const CardWrapper = ({ activity }) => {
  const { city } = useCity();
  const [activityInfo, setActivityInfo] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchDetailedActivity = async (xid) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_HOST
        }/itinerary/activity-detail/${xid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch detailed activity");
      }
      const data = await response.json();
      if (data.preview?.source && data.wikipedia) {
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching detailed activity for xid ${xid}:`, error);
      return null;
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchActivities = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/activities?latitude=${
          city.coords[0]
        }&longitude=${city.coords[1]}&kinds=${activity}`
      );
      const data = await response.json();

      const validActivities = [];
      for (
        let i = 0;
        i < data.features.length && validActivities.length < 5;
        i++
      ) {
        const feature = data.features[i];
        if (feature.properties.name) {
          const detailedActivity = await fetchDetailedActivity(
            feature.properties.xid
          );
          if (detailedActivity) {
            validActivities.push(detailedActivity);
            if (validActivities.length >= 5) break;
          }
          if (i % 5 === 0) {
            await delay(200);
          }
        }
      }

      console.log("Detailed activities fetched:", validActivities);
      setActivityInfo(validActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activity, city]);

  return (
    <div className="container mt-5 mb-5 custom-container bg-primary">
      <div>
        <h1 className="text-center text-white">
          Recommended {activity} nearby
        </h1>
      </div>
      <div className="row justify-content-center">
        {activityInfo && activityInfo.length > 0 ? (
          activityInfo.map((feature) => (
            <div className="col-md-2" key={feature.xid}>
              <Card activityInfo={feature} />
            </div>
          ))
        ) : (
          <div className="text-center text-white">No activities found.</div>
        )}
      </div>
    </div>
  );
};

export default CardWrapper;
