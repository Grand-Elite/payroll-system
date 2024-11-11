import React, { useEffect, useState } from 'react';
import './Shift.css';
import { updateShift } from '../../services/api'; // Adjust the path if `api.js` is located elsewhere

const Shift = () => {
  const [shifts, setShifts] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle any errors
  const [modifiedShifts, setModifiedShifts] = useState({});  // Track modified shifts

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
        setError(error.message);  // Set the error message
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
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

  const handleSave = async (index) => {
    const shiftToSave = shifts[index];
  
    const id = shiftToSave.shiftId; // Assign shiftId as id
    const shiftData = {
      shiftType: shiftToSave.shiftType,
      startTime: shiftToSave.startTime,
      endTime: shiftToSave.endTime,
      department: shiftToSave.department,
    };
    // Show confirmation message
    const confirmed = window.confirm("Are you sure you want to save the changes?");
    if (!confirmed) return; // Cancel the save operation if the user clicks "Cancel"

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

      {loading && <p>Loading...</p>}  {/* Show loading message if data is being fetched */}
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error message if there is an error */}

      {!loading && !error && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Department</th>  
              <th>Shift Type</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th></th>  {/* Column for the Save button */}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.department ? shift.department.name : 'N/A'}</td> {/* Display Department Name */}
                <td>{shift.shiftType}</td>
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
