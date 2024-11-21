import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  TextField,  // Importing TextField for form fields
  Button,     // Button for submitting the form
  Grid,       // Import Grid for layout
} from '@mui/material';
import { fetchEmployees } from '../../services/api';
import './SalaryUpdates.css';  // Import the CSS file

function SalaryUpdates() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    basicSalary: '',
    bonus: '',
  });

  // Fetch employees when component mounts
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const employeeList = await fetchEmployees();
        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmployees();
  }, []);

  // Handle employee selection
  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    setSelectedEmployee(employee);

    // Reset form data when a new employee is selected
    setFormData({
      basicSalary: '',
      bonus: '',
    });
  };

  // Handle change in form fields
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Handle form data submission (e.g., send it to an API or save it)
    console.log('Form Data Submitted:', formData);
  };

  return (
    <Box className="salary-updates-container">
      <Typography className="salary-updates-header" variant="h4" gutterBottom>
        Salary Updates
      </Typography>

      {loadingEmployees ? (
        <CircularProgress />
      ) : (
        <FormControl className="select-employee" variant="outlined" margin="normal">
          <InputLabel>Select Employee</InputLabel>
          <Select
            label="Select Employee"
            value={selectedEmployee?.employeeId || ''}
            onChange={handleEmployeeChange}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.employeeId} value={employee.employeeId}>
                {employee.shortName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Display selected employee's details */}
      {selectedEmployee && (
        <Box className="employee-details-container">
          <Box className="employee-detail-row">
            <Typography className="employee-detail-label" variant="body1">
              Selected Employee
            </Typography>
            <Typography className="employee-detail-colon">:</Typography>
            <Typography className="employee-detail-value">{selectedEmployee.shortName}</Typography>
          </Box>
          <Box className="employee-detail-row">
            <Typography className="employee-detail-label" variant="body1">
              Full Name
            </Typography>
            <Typography className="employee-detail-colon">:</Typography>
            <Typography className="employee-detail-value">{selectedEmployee.fullName}</Typography>
          </Box>
          <Box className="employee-detail-row">
            <Typography className="employee-detail-label" variant="body1">
              Employee ID
            </Typography>
            <Typography className="employee-detail-colon">:</Typography>
            <Typography className="employee-detail-value">{selectedEmployee.employeeId}</Typography>
          </Box>
        </Box>
      )}

      {/* Display form fields only if an employee is selected */}
      {selectedEmployee && (
        <Box className="employee-form-container" mt={2}>
          {/* Basic Salary */}
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1">Basic Salary + BR1 + BR2 </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                label="Enter Basic Salary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Enter value"
                size="small"  
              />
            </Grid>
          </Grid>

          {/* Bonus */}
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1">Bonus</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                label="Enter Bonus"
                name="bonus"
                value={formData.bonus}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Enter value"
                size="small"  // Makes the text box smaller
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default SalaryUpdates;
