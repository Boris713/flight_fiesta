import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CardWrapper.css";
import { useCity } from "../../../contexts/cityContext/cityContext";
import Card from "../Card/Card";

const CardWrapper = ({ activity }) => {
  const { city } = useCity();
  const [activityInfo, setActivityInfo] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const defaultImage = "path/to/default-image.jpg";

  const fetchImage = async (query) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_HOST
        }/itinerary/image-search?query=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching image for query ${query}:`, error);
      return { imageUrl: defaultImage, name: query }; // Use default image on error
    }
  };

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
          const imageResult = await fetchImage(feature.properties.name);
          validActivities.push({
            ...feature,
            imageUrl: imageResult.imageUrl,
            name: feature.properties.name.replace(/_/g, " "), // Remove underscores from name
          });
          if (validActivities.length >= 5) break;
        }
      }

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
    <div className="container mt-5 mb-5 custom-container bg-primary card-wrapper">
      <div>
        <h1 className="text-center text-white">
          Recommended {activity} nearby
        </h1>
      </div>
      <div className="row justify-content-center">
        {activityInfo && activityInfo.length > 0 ? (
          activityInfo.map((feature) => (
            <div
              className="col-lg-2 col-md-3 col-sm-4 col-6 d-flex"
              key={feature.xid}
            >
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
