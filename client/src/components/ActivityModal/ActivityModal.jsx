import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ActivityModal = ({ show, onClose, xid }) => {
  const [activityDetails, setActivityDetails] = useState(null);

  useEffect(() => {
    if (show && xid) {
      const fetchActivityDetails = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REACT_APP_HOST
            }/itinerary/activity-detail/${xid}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch activity details");
          }
          const data = await response.json();
          setActivityDetails(data);
        } catch (error) {
          console.error("Error fetching activity details:", error);
        }
      };

      fetchActivityDetails();
    }
  }, [show, xid]);

  if (!show || !activityDetails) {
    return null;
  }

  const { name, info, image, point, address, url } = activityDetails;
  const coordinates = point;

  return (
    <div
      className={`modal fade show modal-fullscreen`}
      style={{ display: "flex" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="activityModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="activityModalLabel">
              {name}
            </h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{info?.descr || "No description available."}</p>
            <h5>Location</h5>
            <p>
              {address.house_number} {address.road}, {address.neighbourhood},{" "}
              {address.city}, {address.state}, {address.country},{" "}
              {address.postcode}
            </p>
            {coordinates ? (
              <MapContainer
                center={[coordinates.lat, coordinates.lon]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[coordinates.lat, coordinates.lon]}>
                  <Popup>{name}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>No map coordinates available</p>
            )}
            {url && (
              <a
                href={url}
                className="btn btn-primary mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
