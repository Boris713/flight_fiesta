import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CardWrapper.css";
import { useCity } from "../../../contexts/cityContext/cityContext";
import Card from "../Card/Card";
import { act, useEffect, useState } from "react";

const CardWrapper = ({ activity }) => {
  const { city } = useCity();
  const [activityInfo, setActivityInfo] = useState(null);
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/activities?latitude=${
        city[0]
      }&longitude=${city[1]}&kinds=${activity}`
    )
      .then((response) => response.json())
      .then((data) => setActivityInfo(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [city]);

  return (
    <div className="container mt-5 mb-5 custom-container bg-primary">
      <div>
        <h1 className="text-center text-white">
          Recommended {activity} nearby
        </h1>
      </div>
      <div className="row justify-content-center">
        {activityInfo &&
          activityInfo.features
            .filter((feature) => feature.properties.name) // Filter out features without a name
            .slice(0, 5) // Limit to first 5 features
            .map((feature) => (
              <div className="col-md-2" key={feature.properties.xid}>
                <Card activityInfo={feature} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default CardWrapper;
