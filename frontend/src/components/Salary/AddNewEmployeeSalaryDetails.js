/*
//import React, { useState, useEffect } from 'react';
import React, { useState} from 'react';
//import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import './SalaryUpdates.css';

function AddNewEmployeeSalaryDetails() {
  const [formData, setFormData] = useState({
    basicSalary: '',
    attendanceAllowance: '',
    transportAllowance: '',
    performanceAllowance: '',
    incentives: '',
    bonus: '',
    salaryAdvance: '',
    foodBill: '',
    arrears: '',
    otherDeductions: '',
    otRate1: '',
    otRate2: '',
  });

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
        Add New Employee Salary Details
      </Typography>


      {[
        { label: 'Basic Salary + BR1 + BR2', name: 'basicSalary' },
        { label: 'Attendance Allowance', name: 'attendanceAllowance' },
        { label: 'Transport Allowance', name: 'transportAllowance' },
        { label: 'Performance Allowance', name: 'performanceAllowance' },
        { label: 'Incentives', name: 'incentives' },
        { label: 'Bonus', name: 'bonus' },
        { label: 'Salary Advance', name: 'salaryAdvance' },
        { label: 'Food Bill', name: 'foodBill' },
        { label: 'Arrears', name: 'arrears' },
        { label: 'Other Deductions', name: 'otherDeductions' },
        { label: 'OT Rate 1', name: 'otRate1' },
        { label: 'OT Rate 2', name: 'otRate2' },
      ].map((field, index) => (
        <Grid container spacing={1} alignItems="center" key={index}>
          <Grid item xs={3}>
            <Typography variant="subtitle1">{field.label}</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              label={`Enter ${field.label}`}
              name={field.name}
              value={formData[field.name]}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Enter value"
              size="small"
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
  );
}

export default AddNewEmployeeSalaryDetails;
*/