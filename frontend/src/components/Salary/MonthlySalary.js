import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Autocomplete,
} from '@mui/material';
import {
  fetchEmployees,
  getMonthlyFullSalary,
  fetchAttendance,
} from '../../services/api';
import dayjs from 'dayjs';

function MonthlySalary({ selectedMonth, selectedYear }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
    const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const [totalWorkingDays, setTotalWorkingDays] = useState(0);

    const [formData, setFormData] = useState({
      basic: '',
      attendanceAllowance: '',
      transportAllowance: '',
      performanceAllowance: '',
      ot1: '',
      ot2: '',
      totalMonthlySalary: '',
      epfEmployeeAmount:'',
      salaryAdvance: '',
      netSalary: '',
    });


    const fieldLabelMap = {
      basic: "Basic Salary",
      attendanceAllowance: "Attendance Allowance",
      transportAllowance: "Transport Allowance",
      performanceAllowance: "Performance Allowance",
      ot1: "OT-1 Amount", 
      ot2: "OT-2 Amount",
      totalMonthlySalary: "Total Monthly Salary",
      epfEmployeeAmount: "EPF employee Amount",
      salaryAdvance: "Salary Advance",
      netSalary: "Net Salary",
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
          salaryDetails = await getMonthlyFullSalary(employee.employeeId, selectedYear, selectedMonth);
      
          const isSalaryEmpty = Object.values(salaryDetails).every(
            (value) => value === 0 || value === false || value === null
          );
      
          setSalaryDetailsNotFound(isSalaryEmpty);
      
          setFormData({
            basic: salaryDetails.basic ?? '0',
            attendanceAllowance: salaryDetails.attendanceAllowance ?? '0',
            transportAllowance: salaryDetails.transportAllowance ?? '0',
            performanceAllowance: salaryDetails.performanceAllowance ?? '0',
            ot1: salaryDetails.ot1 ?? '0',
            ot2: salaryDetails.ot2 ?? '0',
            totalMonthlySalary: salaryDetails.totalMonthlySalaryl ?? '0',
            epfEmployeeAmount: salaryDetails.epfEmployeeAmount ?? '0',
            salaryAdvance: salaryDetails.salaryAdvance ?? '0',
            netSalary: salaryDetails.netSalary ?? '0',
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
            No salary for {selectedEmployee.shortName} in {selectedMonth}. Please check attendance records and salary base information
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
                  <Typography variant="body1" style={{ marginTop: '8px' }}>
                    {formData[field] || '0'} {/* Show '0' if the value is empty */}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <hr
                    style={{
                      border: 'none',
                      borderTop: '1px dashed gray',
                      margin: '8px 0',
                    }}
                  />
                </Grid>
              </Grid>
              
              ))}
            </Box>
            
            )}
          </>
        )}
      </Box>
    );
  }
  
  export default MonthlySalary;
  

