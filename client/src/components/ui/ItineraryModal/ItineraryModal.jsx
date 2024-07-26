import React from "react";

const ItineraryModal = ({ showModal, handleClose, handleChoice }) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Choose Itinerary Type</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Select an itinerary type:</p>
            <button
              className="btn btn-primary me-2"
              onClick={() => handleChoice("popular")}
            >
              Popular-based Itinerary
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleChoice("recommended")}
            >
              Recommendation-based Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryModal;
