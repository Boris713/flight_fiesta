import React, { useEffect, useState } from "react";
import "../../../CardWrapper.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import ActivityModal from "../../ActivityModal/ActivityModal";
import { useAuth } from "../../../contexts/authContexts/authContexts";
import { useCity } from "../../../contexts/cityContext/cityContext";
import { FaThumbsUp } from "react-icons/fa";

const Card = ({ activityInfo, onRemove }) => {
  const { name, kinds, xid, title, category, image, imageUrl } =
    activityInfo.properties || activityInfo;

  const displayName = name || title;
  const displayKinds = kinds || category;
  const displayImageUrl = imageUrl || image || "path/to/default-image.jpg";

  const learnMoreUrl = `https://www.google.com/search?q=${encodeURIComponent(
    displayName
  )}`;
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(activityInfo.liked);
  const { currentUser } = useAuth();
  const { city } = useCity();

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );

    if (currentUser) {
      fetchLikedStatus();
    }
  }, [currentUser]);

  const fetchLikedStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/get-like-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser.uid, xid }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch like status");
      }

      const data = await response.json();
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleCardClick = async () => {
    setShowModal(true);
    await updateInterests("cardClick", 2);
  };

  const handleLearnMoreClick = async (e) => {
    e.stopPropagation();
    await updateInterests("learnMoreClick", 2);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    await updateLikeStatus();
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

  const updateInterests = async (action, scoreChange) => {
    if (!currentUser || !city) return;

    const interestsData = [
      {
        userId: currentUser.uid,
        category: displayKinds,
        score: scoreChange,
      },
      {
        cityId: city.cityId,
        category: displayKinds,
        score: scoreChange,
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

  const updateLikeStatus = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/update-like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            xid,
            liked: !liked,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like status");
      }

      setLiked(!liked); // Update the liked state
      const scoreChange = !liked ? 4 : -4;
      await updateInterests("likeClick", scoreChange);

      if (liked && onRemove) {
        onRemove(xid); // Call the onRemove callback if unliked
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <>
      <div
        className="card mb-3"
        onClick={handleCardClick}
        style={{ cursor: "pointer", minHeight: "100%" }}
      >
        {displayImageUrl && (
          <img
            src={displayImageUrl}
            className="card-img-top"
            alt={displayName}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5
            className="card-title"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={displayName}
          >
            {displayName}
          </h5>
          <p
            className="card-text"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={formatKinds(displayKinds)}
          >
            {formatKinds(displayKinds)}
          </p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <a
              href={learnMoreUrl}
              className="btn btn-primary card-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLearnMoreClick}
            >
              Learn More
            </a>
            <FaThumbsUp
              onClick={handleLikeClick}
              style={{
                cursor: "pointer",
                color: liked ? "#1877F2" : "#6c757d",
                fontSize: "1.5rem",
                transition: "color 0.3s ease",
              }}
              title={liked ? "Unlike" : "Like"}
            />
          </div>
        </div>
      </div>
      <ActivityModal show={showModal} onClose={handleCloseModal} xid={xid} />
    </>
  );
};

export default Card;
