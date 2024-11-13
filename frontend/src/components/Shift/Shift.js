import React, { useEffect, useState } from 'react';
import './Shift.css';
import { updateShift } from '../../services/api'; // Adjust the path if `api.js` is located elsewhere

const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modifiedShifts, setModifiedShifts] = useState({});

  // Utility function to format enum values (capitalize first letter, lowercase the rest)
  const formatEnum = (value) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  // Fetch shift data from the backend API
  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const response = await fetch('/api/shifts');
        if (!response.ok) {
          throw new Error('Failed to fetch shifts');
        }
        const data = await response.json();

        // Ensure `data` is an array before setting it to `shifts`
        setShifts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching shift data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftData();
  }, []);

  const handleTimeChange = (index, field, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][field] = value;
    setShifts(updatedShifts);

    // Mark the shift as modified
    setModifiedShifts((prevModified) => ({
      ...prevModified,
      [index]: true,
    }));
  };

  // Function to calculate duration between startTime and endTime
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Handle case where end time is after midnight (e.g., 10:00 to 02:00)
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diff = (end - start) / (1000 * 60); // Difference in minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSave = async (index) => {
    const shiftToSave = shifts[index];
    const id = shiftToSave.shiftId;
    const shiftData = {
      shiftType: shiftToSave.shiftType,
      startTime: shiftToSave.startTime,
      endTime: shiftToSave.endTime,
      department: shiftToSave.department,
    };

    const confirmed = window.confirm("Are you sure you want to save the changes?");
    if (!confirmed) return;

    try {
      const response = await updateShift(id, shiftData);
      console.log('Shift saved successfully:', response);
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };

  return (
    <div>
      <header>
        <h2 style={{ marginBottom: '20px' }}>Shift Details</h2>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Department</th>
              <th>Shift Type</th>
              <th>Shift Period</th> {/* Moved Shift Period column here */}
              <th>Start Time</th>
              <th>End Time</th>
              <th>Shift Duration</th>
              <th></th> {/* Column for the Save button */}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.department ? shift.department.name : 'N/A'}</td>
                <td>{shift.shiftType}</td>
                <td>{formatEnum(shift.shiftPeriod)}</td> {/* Display formatted Shift Period */}
                <td>
                  <input
                    type="time"
                    value={shift.startTime}
                    onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={shift.endTime}
                    onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                  />
                </td>
                <td>{calculateDuration(shift.startTime, shift.endTime)}</td>
                <td>
                  {/* Display Save button only if the shift has been modified */}
                  {modifiedShifts[index] && (
                    <button className="save-button" onClick={() => handleSave(index)}>
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Shift;
