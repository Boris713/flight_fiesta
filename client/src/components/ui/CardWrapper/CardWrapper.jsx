import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CardWrapper.css";
import Card from "../Card/Card";

const CardWrapper = () => {
  return (
    <div className="container mt-5 mb-5 custom-container bg-primary">
      <div>
        {/* Will add type of activity in future PR */}
        <h1 className="text-center text-white">Recommended Activity</h1>
      </div>
      {/* Will fill dynamically with info from API */}
      <div className="row justify-content-center">
        <div className="col-md-2 ">
          <Card />
        </div>
        <div className="col-md-2">
          <Card />
        </div>
        <div className="col-md-2">
          <Card />
        </div>
        <div className="col-md-2">
          <Card />
        </div>
        <div className="col-md-2">
          <Card />
        </div>
      </div>
    </div>
  );
};

export default CardWrapper;
