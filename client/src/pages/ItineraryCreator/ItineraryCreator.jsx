import React, { useState } from "react";
import HalfPageLayout from "../../components/ui/HalfPageLayout/HalfPageLayout";
import EditableText from "../../components/EditableText/EditableText";
import DateSelect from "../../components/DateSelect/DateSelect";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const ItineraryCreator = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)), // Set end date to 7 days from today
  });

  const interests = [
    "beach",
    "urban development",
    "museum",
    "shops",
    "tourist attractions",
    "natural",
    "historical",
    "cultural",
    "architecture",
    "amusements",
    "adult",
    "religion",
  ];

  const myEventsList = [
    {
      title: "Sample Event 1",
      start: new Date(2024, 6, 15, 10, 30),
      end: new Date(2024, 6, 15, 11, 30),
    },
    {
      title: "Sample Event 2",
      start: new Date(2024, 6, 17, 14, 0),
      end: new Date(2024, 6, 17, 15, 0),
    },
  ];

  return (
    <HalfPageLayout
      leftChild={
        <div>
          <div className="text-center mb-3">
            <EditableText
              initialText="Title"
              placeholder="Enter title here"
              className="w-100"
            />
          </div>
          <div className="text-center mb-3">
            <EditableText
              initialText="Description"
              placeholder="Enter description here"
              className="w-100"
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
                    value={interest}
                    id={`interest-${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`interest-${index}`}
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </form>
          </div>
          <div className="text-center">
            <button className="btn btn-primary">Generate Itinerary</button>
          </div>
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
            events={myEventsList}
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
  );
};

export default ItineraryCreator;
