import "../../../Card.css";

const Card = ({ activityInfo }) => {
  return (
    <div className="card">
      <img
        src={
          activityInfo.preview
            ? activityInfo.preview.source
            : "default-image.jpg"
        }
        className="card-img-top"
        alt={activityInfo.name}
      />
      <div className="card-body">
        <h5 className="card-title">{activityInfo.name}</h5>
        <a
          href={activityInfo.wikipedia ? activityInfo.wikipedia : "#"}
          className="d-inline-block mr-2"
        >
          Learn More
        </a>
        <a href="#" className=" d-inline-block ">
          Add to itinerary
        </a>
      </div>
    </div>
  );
};

export default Card;
