// Attendance.js
import { Link } from 'react-router-dom';
import AttendanceTable from './AttendanceTable';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Autocomplete,
  Typography,
  TextField,
} from '@mui/material';
import { fetchEmployees, fetchShiftsByDepartment  } from '../../services/api';

function Attendance({ selectedMonth, selectedYear }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [shifts, setShifts] = useState([]); // State to hold multiple shifts

    // Fetch employees when component mounts
    useEffect(() => {
      const loadEmployees = async () => {
        try {
          const employeeList = await fetchEmployees();
          setEmployees(employeeList);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };
      loadEmployees();
    }, []);

    // Fetch shifts based on selected employee’s department
    useEffect(() => {
      if (selectedEmployee && selectedEmployee.department && selectedEmployee.department.departmentId) {
        fetchShiftsByDepartment(selectedEmployee.department.departmentId) 
          .then(response => {
            setShifts(response.data); // Set array of shifts
          })
          .catch(error => {
            console.error("There was an error fetching the shift details!", error);
            setShifts([]); // Reset shifts on error
          });
      } else {
        setShifts([]); // Reset shifts if no valid departmentId
      }
    }, [selectedEmployee]);

const handleEmployeeChange = (newValue) => {
  if (newValue) {
    setSelectedEmployee(newValue);
  } else {
    setSelectedEmployee(null);
  }
};
    return (
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <div className="buttons">
          <Link to="/upload-attendance-excel">
            <button>Upload Employee Attendance</button>
          </Link>
        </div>
        <Autocomplete
              fullWidth
              options={employees}
              getOptionLabel={(option) => option.shortName} // Define what is displayed in the dropdown
              value={selectedEmployee || null} // Handle the selected value
              onChange={(event, newValue) => handleEmployeeChange(newValue)} // Handle changes
              renderInput={(params) => (
                <TextField {...params} label="Select Employee" variant="outlined" margin="normal" />
              )}
              isOptionEqualToValue={(option, value) => option.employeeId === value?.employeeId} // Match logic
            />

        {/* Show the Attendance Table and Shift Details only if an employee is selected */}
        {selectedEmployee && (
          <>
            <Typography variant="h6" align="center" gutterBottom fontWeight={"bold"}>
              {`Attendance for ${selectedMonth} ${selectedYear}`}
            </Typography>
            <br />
            <Typography variant="body1" align="left" gutterBottom style={{ width: '100%' }}>
              <span>{`Employee Name: ${selectedEmployee.fullName}`}</span>
            </Typography>

            {/* Display shift details */}
            {shifts.length > 0 ? (
              shifts.map((shift, index) => (
                <Typography key={index} variant="body1" align="left" gutterBottom>
                  <span>
                    {`Shift ${index + 1}: Start Time - ${shift.startTime}, `}
                    &nbsp;&nbsp;
                    {`End Time - ${shift.endTime}, `}
                    &nbsp;&nbsp;

                    {/* Calculate shift duration */}
                    {(() => {
                      const start = new Date(`1970-01-01T${shift.startTime}`);
                      let end = new Date(`1970-01-01T${shift.endTime}`);

                      // If end time is earlier than start time, add 24 hours (86400000 ms) to end time
                      if (end < start) {
                        end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
                      }

                      // Calculate difference in milliseconds
                      const durationMs = Math.abs(end - start);

                      // Convert milliseconds to hours and minutes
                      const hours = Math.floor(durationMs / (1000 * 60 * 60));
                      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                      return `Shift Duration: ${hours}:${minutes}`;
                    })()}
                  </span>
                </Typography>
              ))
            ) : (
              <Typography variant="body1" align="left" gutterBottom>
                Loading shifts...
              </Typography>
            )}

            <br />
            <AttendanceTable employeeId={selectedEmployee.employeeId} selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </>
        )}
      </Box>
    );
}

export default Attendance;
