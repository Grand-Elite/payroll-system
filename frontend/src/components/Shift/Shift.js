import React, { useEffect, useState } from 'react';
import './Shift.css';
import { updateShift } from '../../services/api'; // Adjust path if needed

const Shift = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modifiedShifts, setModifiedShifts] = useState({});

  // Utility function to format enum values (capitalize first letter)
  const formatEnum = (value) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  // Utility function to calculate shift duration
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    let end = new Date(`1970-01-01T${endTime}`);

    if (end < start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    }

    const durationMs = Math.abs(end - start);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
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
        setShifts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftData();
  }, []);

  // Handle time changes for start and end times
  const handleTimeChange = (index, field, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][field] = value;
    setShifts(updatedShifts);
    setModifiedShifts((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Save updated shift
  const handleSave = async (index) => {
    const shiftToSave = shifts[index];
    const id = shiftToSave.shiftId;
    const shiftData = {
      shiftType: shiftToSave.shiftType,
      startTime: shiftToSave.startTime,
      endTime: shiftToSave.endTime,
      department: shiftToSave.department,
    };

    const confirmed = window.confirm('Are you sure you want to save the changes?');
    if (!confirmed) return;

    try {
      const response = await updateShift(id, shiftData);
      console.log('Shift saved successfully:', response);
      setModifiedShifts((prev) => ({
        ...prev,
        [index]: false,
      }));
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Failed to save shift. Please try again.');
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
              <th>Shift Period</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Shift Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.department ? shift.department.name : 'N/A'}</td>
                <td>{shift.shiftType}</td>
                <td>{formatEnum(shift.shiftPeriod)}</td>
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
