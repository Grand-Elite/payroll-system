import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Grid,
  Autocomplete,
} from '@mui/material';
import {
  fetchEmployees,
  getSalaryDetailByEmployeeId,
  createSalaryDetails,
  updateSalaryDetails,
  fetchAttendance, // Import attendance fetching function
} from '../../services/api';
import './SalaryUpdates.css';

function Salary() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
  const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false); // Loading state for attendance
  const [totalWorkingDays, setTotalWorkingDays] = useState(0); // State for total working days

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

  const getEmployeeProperty = (property) => selectedEmployee?.[property] || '';

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

  const handleEmployeeChange = async (employee) => {
    if (!employee) {
      setSelectedEmployee(null); // Clear the selection if no employee is selected
      setSalaryDetailsNotFound(false); // Reset salary details not found flag
      setTotalWorkingDays(0); // Reset working days
      return;
    }
  
    setSelectedEmployee(employee);
  
    // Fetch salary details for the selected employee
    setLoadingSalaryDetails(true);
    try {
      const salaryDetails = await getSalaryDetailByEmployeeId(employee.employeeId);
  
      // Check if salary details are empty
      const isSalaryEmpty = Object.values(salaryDetails).every(
        (value) => value === 0 || value === false || value === null
      );
  
      setSalaryDetailsNotFound(isSalaryEmpty);
  
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
      setSalaryDetailsNotFound(true);
    } finally {
      setLoadingSalaryDetails(false);
    }
  
    // Fetch attendance data and calculate total working days
    setLoadingAttendance(true);
    try {
      const attendanceData = await fetchAttendance(employee.employeeId);
      
      // Debugging: Log the attendance data to inspect its structure
      console.log('Attendance Data:', attendanceData);
      
      const totalDays = attendanceData.reduce((total, record) => {
        const status = record.attendance;
        
        // Debugging: Log each status to see what's being processed
        console.log('Processing status:', status);
        
        if (status === '1') return total + 1; // Full day
        if (status === '0.5') return total + 0.5; // Half day
        return total; // Skip invalid or absent statuses
      }, 0);
      
      setTotalWorkingDays(totalDays);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setTotalWorkingDays(0); // If there's an error, set working days to 0
    } finally {
      setLoadingAttendance(false);
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
        if (response.status === 201) {
          // Status 201 is for resource creation
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
        Salary
      </Typography>

      {loadingEmployees ? (
        <CircularProgress />
      ) : (
        <Autocomplete
          className="select-employee"
          options={employees}
          getOptionLabel={(option) => option.shortName || ''}
          renderInput={(params) => (
            <TextField {...params} label="Search Employee" variant="outlined" margin="normal" />
          )}
          onChange={(event, value) => {
            handleEmployeeChange(value); // Pass the selected employee object
          }}
          isOptionEqualToValue={(option, value) => option.employeeId === value?.employeeId}
        />
      )}

      {selectedEmployee ? (
        <Box
          className="selected-employee-info"
          mt={2}
          p={2}
          border={1}
          borderRadius={2}
          borderColor="grey.300"
        >
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontWeight: 'bold', marginRight: '24px' }}>Employee ID:</Typography>
            <Typography>{getEmployeeProperty('employeeId')}</Typography>
          </div>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontWeight: 'bold', marginRight: '32px' }}>Short Name:</Typography>
            <Typography>{getEmployeeProperty('shortName')}</Typography>
          </div>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontWeight: 'bold', marginRight: '45px' }}>Full Name:</Typography>
            <Typography>{getEmployeeProperty('fullName')}</Typography>
          </div>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontWeight: 'bold', marginRight: '64px' }}>EPF No:</Typography>
            <Typography>{getEmployeeProperty('epfNo')}</Typography>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>Total Working Days:</Typography>
            {loadingAttendance ? <CircularProgress size={20} /> : <Typography>{totalWorkingDays}</Typography>}
          </div>
        </Box>
      ) : (
        <Typography color="textSecondary" variant="body1" mt={2}>
          No employee selected.
        </Typography>
      )}

      {salaryDetailsNotFound && selectedEmployee && (
        <Typography color="error" variant="body1" style={{ marginTop: '10px' }}>
          No salary details available for {selectedEmployee.shortName}. Please insert new salary details.
        </Typography>
      )}

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
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}
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
                          color: 'gray',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
                {salaryDetailsNotFound ? 'Create Salary Details' : 'Update Salary Details'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Salary;
