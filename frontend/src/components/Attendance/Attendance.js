import { Link } from 'react-router-dom';
import AttendanceTable from './AttendanceTable';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';
import { fetchEmployees } from '../../services/api';
import dayjs from 'dayjs';

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
  
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
  
    // Handle employee selection
    const handleEmployeeChange = (event) => {
      const employeeId = event.target.value;
      const employee = employees.find((emp) => emp.employeeId === employeeId);
      setSelectedEmployee(employee);
    };
  
    return (
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <div className="buttons">
            <Link to="/upload-attendance-excel">
                <button>Upload Employee Attendance</button>
            </Link>
        </div>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Select Employee</InputLabel>
          <Select
            label="Select Employee"
            value={selectedEmployee ? selectedEmployee.employeeId : ""}
            onChange={handleEmployeeChange}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.employeeId} value={employee.employeeId}>
                {employee.shortName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* Show the Attendance Table only if an employee is selected */}
        {selectedEmployee && (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              {`Attendance for ${dayjs().format('MMMM YYYY')}`}
            </Typography>
            <Typography variant="h8" align="left" gutterBottom style={{ width: '100%' }}>
            {`Employee Name: ${selectedEmployee.shortName}`}
            </Typography>
            <AttendanceTable employeeId={selectedEmployee.employeeId}/>
          </>
        )}
      </Box>
    );
};
export default Attendance;