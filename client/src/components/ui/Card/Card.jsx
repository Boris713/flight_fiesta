import React, { useEffect, useState } from "react";
import "../../../CardWrapper.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import ActivityModal from "../../ActivityModal/ActivityModal";
import { useAuth } from "../../../contexts/authContexts/authContexts"; // Adjust the path as necessary
import { useCity } from "../../../contexts/cityContext/cityContext"; // Import useCity hook

const Card = ({ activityInfo }) => {
  const { name, kinds, xid } = activityInfo.properties;
  const imageUrl = activityInfo.imageUrl;
  const learnMoreUrl = `https://www.google.com/search?q=${encodeURIComponent(
    name
  )}`;

  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();
  const { city } = useCity();

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }, []);

  const handleCardClick = async () => {
    setShowModal(true);
    await updateInterests("cardClick");
  };

  const handleLearnMoreClick = async (e) => {
    e.stopPropagation();
    await updateInterests("learnMoreClick");
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

  const updateInterests = async (action) => {
    if (!currentUser || !city) return;

    const interestsData = [
      {
        userId: currentUser.uid,
        category: kinds,
        score: action === "cardClick" ? 2 : 4,
      },
      {
        cityId: city.cityId,
        category: kinds,
        score: action === "cardClick" ? 2 : 4,
      },
    ];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/update-points`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(interestsData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Response not OK:", result);
        throw new Error("Failed to update interests");
      }
    } catch (error) {
      console.error("Error updating interests:", error);
    }
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
            onClick={handleLearnMoreClick}
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
