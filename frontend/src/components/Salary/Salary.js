import React, { useState, useEffect, useCallback } from 'react';
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
  fetchAttendance,
} from '../../services/api';
import dayjs from 'dayjs';

function Salary({ selectedMonth, selectedYear }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
    const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const [totalWorkingDays, setTotalWorkingDays] = useState(0);

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
      lateChargesPerMin: '',
    });


    const fieldLabelMap = {
      basicSalary: "Basic Salary",
      bonus: "Bonus",
      attendanceAllowance: "Attendance Allowance",
      transportAllowance: "Transport Allowance",
      performanceAllowance: "Performance Allowance",
      incentives: "Incentives",
      salaryAdvance: "Salary Advance",
      foodBill: "Food Bill",
      arrears: "Arrears",
      otherDeductions: "Other Deductions",
      ot1Rate: "OT-1 Amount", // Updated label
      ot2Rate: "OT-2 Amount",
      lateChargesPerMin: 'Late Charges',
    };
    

    const getEmployeeProperty = (property) => selectedEmployee?.[property] || '';

    // Memoize handleEmployeeChange to avoid redefinition on every render
    const handleEmployeeChange = useCallback(async (employee) => {
        if (!employee) {
          setSelectedEmployee(null);
          setSalaryDetailsNotFound(false);
          setTotalWorkingDays(0);
          return;
        }
      
        setSelectedEmployee(employee);
      
        // Fetch salary details for the selected employee
        setLoadingSalaryDetails(true);
        let salaryDetails = {};  // Declare salaryDetails here to ensure it's available later
        try {
          salaryDetails = await getSalaryDetailByEmployeeId(employee.employeeId);
      
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
            lateChargesPerMin: salaryDetails.lateChargesPerMin || '',
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
      
          // Filter attendance data based on selected month and year
          const filteredAttendanceData = attendanceData.filter((record) => {
            const recordDate = dayjs(record.date);
            return (
              recordDate.format("MMMM") === selectedMonth &&
              recordDate.year() === parseInt(selectedYear, 10)
            );
          });
      
          // Calculate total working days
          const totalDays = filteredAttendanceData.reduce((total, record) => {
            const status = record.attendance;
            if (status === '1') return total + 1; // Full day
            if (status === '0.5') return total + 0.5; // Half day
            return total; // Skip invalid or absent statuses
          }, 0);
      
          setTotalWorkingDays(totalDays);
      
          // Update the allowances based on total working days
          if (salaryDetails.attendanceAllowance) {
            const newAttendanceAllowance = salaryDetails.attendanceAllowance * totalDays;
            setFormData((prevData) => ({
              ...prevData,
              attendanceAllowance: newAttendanceAllowance,
            }));
          }
      
          if (salaryDetails.transportAllowance) {
            const newTransportAllowance = salaryDetails.transportAllowance * totalDays;
            setFormData((prevData) => ({
              ...prevData,
              transportAllowance: newTransportAllowance,
            }));
          }
      
          if (salaryDetails.performanceAllowance) {
            const newPerformanceAllowance = salaryDetails.performanceAllowance * totalDays;
            setFormData((prevData) => ({
              ...prevData,
              performanceAllowance: newPerformanceAllowance,
            }));
          }
        } catch (error) {
          console.error('Error fetching attendance data:', error);
          setTotalWorkingDays(0);
        } finally {
          setLoadingAttendance(false);
        }
      }, [selectedMonth, selectedYear]);
      
      

    // Fetch employees
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

    useEffect(() => {
        if (selectedEmployee) {
          handleEmployeeChange(selectedEmployee);
        }
      }, [selectedEmployee, selectedMonth, selectedYear, handleEmployeeChange]);

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
        if (salaryDetailsNotFound) {
          const response = await createSalaryDetails(selectedEmployee.employeeId, formData);
          if (response.status === 201) {
            alert('Salary details created successfully!');
          }
        } else {
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
              handleEmployeeChange(value);
            }}
            isOptionEqualToValue={(option, value) => option.employeeId === value?.employeeId}
          />
        )}
  
        {selectedEmployee ? (
          <Box className="selected-employee-info" mt={2} p={2} border={1} borderRadius={2} borderColor="grey.300">
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
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontWeight: 'bold', marginRight: '20px' }}>No. of Days Worked in {selectedMonth}:</Typography>
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
                      {fieldLabelMap[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
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
                        inputProps: {
                          min: 0, // Optional: Ensure non-negative input for numerical fields
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: '10px' }}
              >
                Submit
              </Button>
            </Box>
            
            )}
          </>
        )}
      </Box>
    );
  }
  
  export default Salary;
  