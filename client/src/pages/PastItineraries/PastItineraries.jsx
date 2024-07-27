import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const PastItineraries = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/fetch-itineraries`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch itineraries");
      }
      const data = await response.json();
      console.log("Fetched itineraries:", data); // Log fetched data
      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  const formatEvents = (activities) => {
    console.log("Raw activities:", activities); // Log raw activities data
    const events = activities.map((activity) => {
      const startTime = new Date(activity.startTime);
      const endTime = new Date(activity.endTime);
      console.log(
        "Activity:",
        activity.title,
        "Start:",
        startTime,
        "End:",
        endTime
      ); // Log each activity's start and end times
      return {
        title: activity.title,
        start: startTime, // Ensure start time is a Date object
        end: endTime, // Ensure end time is a Date object
      };
    });
    console.log("Formatted events:", events); // Log formatted events
    return events;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Past Itineraries</h1>
      <div className="row">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <div key={itinerary.id} className="col-lg-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{itinerary.title}</h5>
                  <p className="card-text">{itinerary.description}</p>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                    {new Date(itinerary.endDate).toLocaleDateString()}
                  </h6>
                  <div style={{ height: "500px" }}>
                    <FullCalendar
                      key={itinerary.id}
                      plugins={[dayGridPlugin]}
                      initialView="dayGridWeek"
                      initialDate={new Date(itinerary.startDate)}
                      headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridDay,dayGridWeek",
                      }}
                      events={formatEvents(itinerary.activities)}
                      eventTimeFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        meridiem: "short",
                        hour12: true,
                      }}
                      validRange={{
                        start: new Date(itinerary.startDate),
                        end: new Date(itinerary.endDate),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No itineraries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastItineraries;
