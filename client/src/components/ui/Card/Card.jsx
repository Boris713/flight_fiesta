import React, { useEffect, useState } from "react";
import "../../../CardWrapper.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import ActivityModal from "../../ActivityModal/ActivityModal";

const Card = ({ activityInfo }) => {
  const { name, kinds, xid } = activityInfo.properties; // Ensure xid is being destructured correctly
  const imageUrl = activityInfo.imageUrl;
  const learnMoreUrl = `https://www.google.com/search?q=${encodeURIComponent(
    name
  )}`;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }, []);

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatKinds = (kinds) => {
    if (!kinds) return "";
    return kinds
      .split(",")
      .map((kind) => `#${kind.replace(/_/g, " ")}`)
      .join(" ");
  };

  return (
    <>
      <div
        className="card mb-3"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        {imageUrl && <img src={imageUrl} className="card-img-top" alt={name} />}
        <div className="card-body">
          <h5
            className="card-title"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={name}
          >
            {name}
          </h5>
          <p
            className="card-text"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={formatKinds(kinds)}
          >
            {formatKinds(kinds)}
          </p>
          <a
            href={learnMoreUrl}
            className="btn btn-primary card-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
          </a>
        </div>
      </div>
      <ActivityModal show={showModal} onClose={handleCloseModal} xid={xid} />
    </>
  );
};

export default Card;
