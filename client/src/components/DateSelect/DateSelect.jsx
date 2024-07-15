import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

function DateSelect({ onChange }) {
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  );

  useEffect(() => {
    if (departureDate <= arrivalDate) {
      const newDepartureDate = new Date(
        arrivalDate.getTime() + 24 * 60 * 60 * 1000
      );
      setDepartureDate(newDepartureDate);
    }
    onChange(arrivalDate, departureDate);
  }, [arrivalDate, departureDate, onChange]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <h2>Select Dates</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>Arrival</h3>
          <DatePicker
            selected={arrivalDate}
            onChange={(date) => setArrivalDate(date)}
            selectsStart
            startDate={arrivalDate}
            endDate={departureDate}
            minDate={new Date()}
          />
        </div>
        <div className="col-md-6">
          <h3>Departure</h3>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            selectsEnd
            startDate={arrivalDate}
            endDate={departureDate}
            minDate={new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000)}
          />
        </div>
      </div>
    </div>
  );
}

export default DateSelect;
