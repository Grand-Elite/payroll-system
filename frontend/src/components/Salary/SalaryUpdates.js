import React, { useState, useEffect } from 'react';

import {
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { fetchEmployees, getSalaryDetailByEmployeeId, updateSalaryDetails, createSalaryDetails } from '../../services/api';
import './SalaryUpdates.css';

function SalaryUpdates() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
  const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);

  const [formData, setFormData] = useState({
    basicSalary: '',
    bonus: '',
    attendanceAllowance: '',
    transportAllowance: '',
    performanceAllowance: '',
    incentives: '',
    salaryAdvance: '',
    foodBill: '',
    arrears: '',
    otherDeductions: '',
    ot1Rate: '',
    ot2Rate: '',
  });

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

  const handleEmployeeChange = async (event) => {
    const employeeId = event.target.value;
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    setSelectedEmployee(employee);
  
    // Fetch salary details for the selected employee
    setLoadingSalaryDetails(true);
    try {
      const salaryDetails = await getSalaryDetailByEmployeeId(employeeId);
  
      // If no salary details are found, set the state accordingly
      const isSalaryEmpty = Object.values(salaryDetails).every(value => value === 0 || value === false || value === null);
      
      if (isSalaryEmpty) {
        setSalaryDetailsNotFound(true);
      } else {
        setSalaryDetailsNotFound(false);
      }
  
      setFormData({
        basicSalary: salaryDetails.basicSalary || '',
        bonus: salaryDetails.bonus || '',
        attendanceAllowance: salaryDetails.attendanceAllowance || '',
        transportAllowance: salaryDetails.transportAllowance || '',
        performanceAllowance: salaryDetails.performanceAllowance || '',
        incentives: salaryDetails.incentives || '',
        salaryAdvance: salaryDetails.salaryAdvance || '',
        foodBill: salaryDetails.foodBill || '',
        arrears: salaryDetails.arrears || '',
        otherDeductions: salaryDetails.otherDeductions || '',
        ot1Rate: salaryDetails.ot1Rate || '',
        ot2Rate: salaryDetails.ot2Rate || '',
      });
    } catch (error) {
      console.error('Error fetching salary details:', error);
      setSalaryDetailsNotFound(true); // Set to true if there's an error fetching salary details
    } finally {
      setLoadingSalaryDetails(false);
    }
  };
  

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 const handleSubmit = async () => {
  if (!selectedEmployee) {
    alert('Please select an employee.');
    return;
  }

  try {
    // If salary details are not found (error message is shown), create a new record
    if (salaryDetailsNotFound) {
      const response = await createSalaryDetails(selectedEmployee.employeeId, formData);
      if (response.status === 201) { // Status 201 is for resource creation
        alert('Salary details created successfully!');
      }
    } else {
      // Otherwise, update the existing salary details
      const response = await updateSalaryDetails(selectedEmployee.employeeId, formData);
      if (response.status === 200) {
        alert('Salary details updated successfully!');
      }
    }
  } catch (error) {
    console.error('Error submitting salary details:', error);
    alert('An error occurred while submitting salary details. Please try again.');
  }
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
  
      {/* Displaying selected employee's basic information */}
      {selectedEmployee && (
        <Box 
          className="selected-employee-info" 
          mt={2} 
          p={2} 
          border={1} 
          borderRadius={2} 
          borderColor="grey.300"
        >
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontWeight: 'bold', marginRight: '28px' }}>Employee ID:</Typography>
              <Typography>{selectedEmployee.employeeId}</Typography>
            </div>
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontWeight: 'bold', marginRight: '32px' }}>Short Name:</Typography>
              <Typography>{selectedEmployee.shortName}</Typography>
            </div>
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontWeight: 'bold', marginRight: '45px' }}>Full Name:</Typography>
              <Typography>{selectedEmployee.fullName}</Typography>
            </div>
        </Box>
      )}
  
      {/* Displaying error message if no salary details are found */}
      {salaryDetailsNotFound && (
        <Typography color="error" variant="body1" style={{ marginTop: '10px' }}>
          No salary details available for {selectedEmployee.shortName}. Please insert new salary details.
        </Typography>
      )}
  
      {/* Displaying the employee's salary form */}
      {selectedEmployee && (
        <>
          {loadingSalaryDetails ? (
            <CircularProgress />
          ) : (
            <Box className="employee-form-container" mt={2}>
              {Object.keys(formData).map((field) => (
                <Grid container spacing={1} alignItems="center" key={field}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">
                      {field
                        .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
                        .replace(/^./, (str) => str.toUpperCase())} {/* Capitalize first letter */}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      name={field}
                      value={formData[field]}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      size="small"
                      InputProps={{
                        style: {
                          color: 'gray', // Sets the text color to gray
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
  
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
    }

export default SalaryUpdates;
