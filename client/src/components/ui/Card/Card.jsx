import "../../../Card.css";
const Card = ({ activityInfo }) => {
  console.log(activityInfo.properties.name);
  return (
    <div className="card">
      {/* img link */}
      <img src="..." className="card-img-top" alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{activityInfo.properties.name}</h5>
        {/* activity name */}
        <a href="#" className="d-inline-block mr-2">
          Learn More
        </a>
        {/* wiki link */}
        <a href="#" className=" d-inline-block ">
          Add to itinerary
        </a>
      </div>
    </div>
  );
};

export default Card;
