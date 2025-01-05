import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './HolidayCalendar.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveHolidays, fetchHolidays, deleteHoliday } from '../../services/api';

function HolidayCalendar() {
  const [holidays, setHolidays] = useState({});
  const [confirmedHolidays, setConfirmedHolidays] = useState({});
  const [setViewDate] = useState(new Date());

  useEffect(() => {
    fetchHolidays()
      .then((data) => {
        const holidayMap = data.reduce((acc, holiday) => {
          acc[new Date(holiday.holidayDate).toDateString()] = {
            description: holiday.description,
            mandatory: holiday.mandatory || false,
          };
          return acc;
        }, {});
        setConfirmedHolidays(holidayMap);
      })
      .catch((error) => console.error('Error fetching holidays:', error));
  }, []);

  const handleViewChange = ({ activeStartDate }) => {
    setViewDate(activeStartDate);
  };

  const handleMandatoryChange = (event, dateString) => {
    const { checked } = event.target;
    console.log('Updating mandatory to:', checked);  // Check the checkbox value
    setHolidays((prevHolidays) => ({
      ...prevHolidays,
      [dateString]: {
        ...prevHolidays[dateString],
        mandatory: checked,  // Update the state
      },
    }));
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
            toast.success('Holiday deleted successfully.');
          })
          .catch((error) => alert('Error deleting holiday: ' + error.message));
      }
    } else {
      setHolidays((prevHolidays) => ({
        ...prevHolidays,
        [dateString]: {
          description: '',
          mandatory: false, // Default to false for new holidays
        },
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
      [dateString]: {
        ...prevHolidays[dateString],
        description: value,
      },
    }));
  };

  const handleConfirmHolidays = () => {
    const updatedHolidays = { ...holidays };
    console.log('Sending holidays to backend:', updatedHolidays);  // Log the holidays data
    saveHolidays(updatedHolidays)
      .then(() => {
        setConfirmedHolidays((prev) => ({
          ...prev,
          ...holidays,
        }));
        setHolidays({});
        toast.success("Holidays have been confirmed!");
      })
      .catch((error) => alert("Error saving holidays: " + error.message));
  };

  const tileContent = ({ date }) => {
    const dateString = date.toDateString();
    if (confirmedHolidays[dateString]) {
      return <div className="holiday-marker">{confirmedHolidays[dateString].description}</div>;
    }
    if (holidays[dateString]) {
      return <div className="holiday-marker">{holidays[dateString]?.description || 'Pending'}</div>;
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
        {Object.entries(holidays).map(([dateString, holidayData]) => (
          <div key={dateString} className="holiday-details">
            <h3>Selected Date: {dateString}</h3>
            <label htmlFor={`description-${dateString}`}>Description:</label>
            <input
              type="text"
              id={`description-${dateString}`}
              value={holidayData?.description || ''}
              onChange={(e) => handleDescriptionChange(e, dateString)}
              placeholder="Enter holiday description"
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={holidayData?.mandatory || false}
                onChange={(e) => handleMandatoryChange(e, dateString)}
                id={`mandatory-${dateString}`}
              />
              <label htmlFor={`mandatory-${dateString}`}>Mandatory Holiday - Poya Day</label>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(holidays).length > 0 && (
        <button className="confirm-button" onClick={handleConfirmHolidays}>
          Confirm Holidays
        </button> 
      )}
      <ToastContainer/>
    </div>
  );
}

export default HolidayCalendar;
