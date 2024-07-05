import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CardWrapper.css";
import { useFillRecommendations } from "../../../hooks/FillRecommendations/useFillRecommendations";
import Card from "../Card/Card";
// here will get kinds and then fetch data and map cards fetched
const CardWrapper = ({ activity }) => {
  // function that maps items to cards
  const activityData = useFillRecommendations(activity);

  return (
    <div className="container mt-5 mb-5 custom-container bg-primary">
      <div>
        {/* Will create Util to parse in future */}
        <h1 className="text-center text-white">
          Recommended {activity} nearby
        </h1>
      </div>
      {/* Will fill dynamically with info from API */}
      <div className="row justify-content-center">
        {activityData &&
          activityData.features
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
