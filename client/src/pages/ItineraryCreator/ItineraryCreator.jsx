import React, { useState, useRef } from "react";
import HalfPageLayout from "../../components/ui/HalfPageLayout/HalfPageLayout";
import EditableText from "../../components/EditableText/EditableText";
import DateSelect from "../../components/DateSelect/DateSelect";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCity } from "../../contexts/cityContext/cityContext";
import { useAuth } from "../../contexts/authContexts/authContexts";
import ItineraryModal from "../../components/ui/ItineraryModal/ItineraryModal";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

const ItineraryCreator = () => {
  const { currentUser } = useAuth();
  const { city } = useCity();
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)), // Set end date to 7 days from today
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const [eventList, setEventList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([
    "adult",
    "amusements",
    "water_parks",
    "architecture",
    "museums",
    "cultural",
    "theatres_and_entertainments",
    "urban_environment",
    "historic",
    "natural",
    "foods",
  ]);
  const [itineraryType, setItineraryType] = useState("active");
  const [itineraryOptions, setItineraryOptions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(true); // State for save button
  const [itineraryData, setItineraryData] = useState(null); // State for itinerary data

  const titleRef = useRef();
  const descriptionRef = useRef();

  const interests = [
    { display: "Adult", value: "adult" },
    { display: "Amusements", value: "amusements" },
    { display: "Water Parks", value: "water_parks" },
    { display: "Architecture", value: "architecture" },
    { display: "Museums", value: "museums" },
    { display: "Cultural", value: "cultural" },
    {
      display: "Theaters and Entertainments",
      value: "theatres_and_entertainments",
    },
    { display: "Urban Environment", value: "urban_environment" },
    { display: "Historical", value: "historic" },
    { display: "Natural", value: "natural" },
    { display: "Foods", value: "foods" },
  ];

  const handleInterestChange = (interestValue) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestValue)) {
        return prev.filter((item) => item !== interestValue);
      } else {
        return [...prev, interestValue];
      }
    });
  };

  const simulateProgress = (duration) => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const progress = Math.min(
        ((now - startTime) / (endTime - startTime)) * 100,
        100
      );

      if (progress >= 100) {
        setProgress(100);
      } else {
        setProgress(progress);
        setTimeout(updateProgress, 50);
      }
    };

    updateProgress();
  };

  const generateItinerary = async () => {
    setLoading(true);
    setProgress(0);
    simulateProgress(4000);

    setClicked(true);
    try {
      const interests = JSON.stringify(selectedInterests);
      const queryParams = new URLSearchParams({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
        interests: interests,
        type: itineraryType,
        latitude: city.coords[0].toString(),
        longitude: city.coords[1].toString(),
        cityId: city.cityId.toString(),
      }).toString();

      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_HOST
        }/itinerary/generate?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setItineraryOptions(data);
      setShowModal(true); // Show the modal after fetching the itinerary
    } catch (error) {
      console.error("Failed to fetch itinerary:", error);
      console.error("Error Details:", error.message);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };
  const fillCalendar = (data) => {
    if (!data || !Array.isArray(data.itinerary1)) {
      console.error("Invalid itinerary data:", data);
      return;
    }

    const { itinerary1 } = data;
    const events = itinerary1
      .map((day, index) => {
        if (!Array.isArray(day)) {
          console.error("Expected day to be an array:", day);
          return [];
        }

        return day.map((entry) => {
          const eventDate = new Date(dateRange.start);
          eventDate.setDate(eventDate.getDate() + index);
          if (entry.time) {
            const [hours, minutes] = entry.time.split(":");
            eventDate.setHours(hours);
            eventDate.setMinutes(minutes);
          }

          const activity = entry.activity;
          const activityName = activity?.properties?.name || "Unnamed Activity";

          return {
            title: activityName,
            start: eventDate,
          };
        });
      })
      .flat();
    setEventList(events);
  };
  const handleModalChoice = (choice) => {
    let selectedItinerary;
    if (choice === "popular") {
      selectedItinerary = itineraryOptions.itinerary1;
    } else if (itineraryOptions.itinerary2) {
      selectedItinerary = itineraryOptions.itinerary2;
    } else {
      console.error("No valid itinerary option selected:", choice);
      return;
    }
    fillCalendar({ itinerary1: selectedItinerary });
    setItineraryData(selectedItinerary); // Save the selected itinerary data
    setShowSaveButton(true);
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const saveItinerary = async () => {
    if (!itineraryData) {
      console.error("No itinerary data to save");
      return;
    }
    setLoading(true);
    setProgress(0);
    simulateProgress(4000); // Simulate progress over 4 seconds

    try {
      const title = titleRef.current.getText(); // Get the title from the EditableText component
      const description = descriptionRef.current.getText(); // Get the description from the EditableText component

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_HOST}/itinerary/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser,
            cityId: city.cityId,
            title,
            description,
            startDate: dateRange.start,
            endDate: dateRange.end,
            activities: itineraryData
              .map((day) =>
                day.map((activity) => ({
                  title: activity.activity.properties.name,
                  category: activity.activity.properties.kinds,
                  startTime: new Date(activity.time),
                  endTime: new Date(activity.time),
                  xid: activity.activity.properties.xid,
                  image: activity.activity.properties.image,
                  wikiLink: activity.activity.properties.wikidata,
                }))
              )
              .flat(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save itinerary");
      }
    } catch (error) {
      console.error("Failed to save itinerary:", error);
      console.error("Error Details:", error.message);
    } finally {
      setLoading(false);
      setProgress(100);
      setShowSaveButton(false); // Hide save button after saving
    }
  };

  return (
    <>
      {loading ? (
        <ProgressBar progress={progress} /> // Display the ProgressBar with progress state
      ) : (
        <HalfPageLayout
          leftChild={
            <div>
              <div className="text-center mb-3">
                <EditableText
                  initialText="Title"
                  placeholder="Enter title here"
                  className="w-100"
                  ref={titleRef}
                />
              </div>
              <div className="text-center mb-3">
                <EditableText
                  initialText="Description"
                  placeholder="Enter description here"
                  className="w-100"
                  ref={descriptionRef}
                />
              </div>
              <div className="text-center mb-3">
                <DateSelect
                  onChange={(start, end) => setDateRange({ start, end })}
                />
              </div>
              <div className="text-center mb-3">
                <h3>Include:</h3>
                <form className="d-flex flex-wrap justify-content-center">
                  {interests.map((interest, index) => (
                    <div key={index} className="form-check mx-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={interest.value}
                        id={`interest-${index}`}
                        onChange={() => handleInterestChange(interest.value)}
                        checked={selectedInterests.includes(interest.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`interest-${index}`}
                      >
                        {interest.display}
                      </label>
                    </div>
                  ))}
                </form>
              </div>

              <div className="text-center mb-3">
                <label>Itinerary Type:</label>
                <select
                  value={itineraryType}
                  onChange={(e) => setItineraryType(e.target.value)}
                  className="form-control"
                >
                  <option value="active">Active</option>
                  <option value="passive">Passive</option>
                </select>
              </div>
              <div className="text-center">
                <button className="btn btn-primary" onClick={generateItinerary}>
                  Generate Itinerary
                </button>
              </div>
              {showSaveButton && (
                <div className="text-center mt-3">
                  <button className="btn btn-success" onClick={saveItinerary}>
                    Save Itinerary
                  </button>
                </div>
              )}
            </div>
          }
          rightChild={
            <div style={{ height: "500px" }}>
              <FullCalendar
                key={`${dateRange.start.toISOString()}-${dateRange.end.toISOString()}`}
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                initialDate={dateRange.start}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridDay,dayGridWeek",
                }}
                events={eventList}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  meridiem: "short",
                  hour12: true,
                }}
                validRange={{
                  start: dateRange.start,
                  end: dateRange.end,
                }}
              />
            </div>
          }
        />
      )}
      <ItineraryModal
        showModal={showModal}
        handleClose={handleModalClose}
        handleChoice={handleModalChoice}
      />
    </>
  );
};

export default ItineraryCreator;
