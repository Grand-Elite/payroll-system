import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './HolidayCalendar.css'; // Import custom styles
import { saveHolidays, fetchHolidays, deleteHoliday } from '../../services/api';

function HolidayCalendar() {
  const [holidays, setHolidays] = useState({});
  const [confirmedHolidays, setConfirmedHolidays] = useState({});
  const [setViewDate] = useState(new Date());

  useEffect(() => {
    fetchHolidays()
      .then((data) => {
        const holidayMap = data.reduce((acc, holiday) => {
          acc[new Date(holiday.holidayDate).toDateString()] = holiday.description;
          return acc;
        }, {});
        setConfirmedHolidays(holidayMap);
      })
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  const handleViewChange = ({ activeStartDate }) => {
    setViewDate(activeStartDate);
  };

  const toggleHoliday = (date) => {
    const dateString = date.toDateString();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if (dateString in holidays) {
      setHolidays((prevHolidays) => {
        const { [dateString]: _, ...remainingHolidays } = prevHolidays;
        return remainingHolidays;
      });
    } else if (dateString in confirmedHolidays) {
      const isConfirmed = window.confirm(
        `Are you sure you want to remove the holiday on ${dateString}?`
      );
      if (isConfirmed) {
        deleteHoliday(formattedDate)
          .then(() => {
            setConfirmedHolidays((prevConfirmed) => {
              const { [dateString]: _, ...remainingConfirmed } = prevConfirmed;
              return remainingConfirmed;
            });
            alert('Holiday deleted successfully.');
          })
          .catch((error) => alert('Error deleting holiday: ' + error.message));
      }
    } else {
      setHolidays((prevHolidays) => ({
        ...prevHolidays,
        [dateString]: '',
      }));
    }
  };

  const handleDayClick = (value) => {
    const selectedDate = new Date(value);
    toggleHoliday(selectedDate);
  };

  const handleDescriptionChange = (event, dateString) => {
    const { value } = event.target;
    setHolidays((prevHolidays) => ({
      ...prevHolidays,
      [dateString]: value,
    }));
  };

  const handleConfirmHolidays = () => {
    saveHolidays(holidays)
      .then(() => {
        setConfirmedHolidays((prev) => ({
          ...prev,
          ...holidays,
        }));
        setHolidays({});
        alert("Holidays have been confirmed!");
      })
      .catch((error) => alert("Error saving holidays: " + error.message));
  };

  const tileContent = ({ date }) => {
    const dateString = date.toDateString();
    if (dateString in confirmedHolidays) {
      return <div className="holiday-marker">{confirmedHolidays[dateString]}</div>;
    }
    if (dateString in holidays) {
      return <div className="holiday-marker">{holidays[dateString] || 'Pending'}</div>;
    }
    return null;
  };

  return (
    <div className="App">
      <h1>Company Holiday Calendar</h1>
      <div className="calendar-layout">
        <div className="calendar-container">
          <Calendar
            onClickDay={handleDayClick}
            tileContent={tileContent}
            onViewChange={handleViewChange}
          />
        </div>
      </div>
      <div className="holiday-details-container">
        {Object.entries(holidays).map(([dateString, description]) => (
          <div key={dateString} className="holiday-details">
            <h3>Selected Date: {dateString}</h3>
            <label htmlFor={`description-${dateString}`}>Description:</label>
            <input
              type="text"
              id={`description-${dateString}`}
              value={description}
              onChange={(e) => handleDescriptionChange(e, dateString)}
              placeholder="Enter holiday description"
            />
          </div>
        ))}
      </div>
      {Object.keys(holidays).length > 0 && (
        <button className="confirm-button" onClick={handleConfirmHolidays}>
          Confirm Holidays
        </button>
      )}
    </div>
  );
}

export default HolidayCalendar;
