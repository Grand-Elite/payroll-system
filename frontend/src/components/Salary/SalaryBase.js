import React, { useState, useEffect,useCallback } from 'react';
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
  getMonthlySalaryDetails,
  updateSalaryDetails,
  createSalaryDetails,
  createMonthlySalaryUpdate,
  updateMonthlySalaryUpdate,
} from '../../services/api';
import './SalaryBase.css';

function SalaryBase({ selectedMonth, selectedYear }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
  const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);
  const [monthlySalaryDetailsNotFound, setMonthlySalaryDetailsNotFound] = useState(false);

  const [formData, setFormData] = useState({
    basicSalary: '',
    attendanceAllowance: '',
    transportAllowance: '',
    performanceAllowance: '',
    ot1Rate: '',
    ot2Rate: '',
    workingHours: '',
    lateChargesPerMin: '0.00',

  });

  const [monthlyData, setMonthlyData] = useState({
    bonus: '',
    incentives: '',
    salaryAdvance: '',
    foodBill: '',
    arrears: '',
    otherDeductions: '',
    year: '', 
    month: '',
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

  const handleEmployeeChange = useCallback(async (employee) => {
    if (!employee) {
      setSelectedEmployee(null);
      setSalaryDetailsNotFound(false);
      return;
    }

    setSelectedEmployee(employee);
    setLoadingSalaryDetails(true);

    try {
      const salaryDetails = await getSalaryDetailByEmployeeId(employee.employeeId);
      const monthlySalaryDetails = await getMonthlySalaryDetails(employee.employeeId, selectedYear, selectedMonth);

      const isSalaryEmpty = Object.values(salaryDetails || {}).every(
        (value) => value === 0 || value === false || value === null
      );

      const isMonthlySalaryEmpty = Object.values(monthlySalaryDetails || {}).every(
        (value) => value === 0 || value === false || value === null
      );

      

      setSalaryDetailsNotFound(isSalaryEmpty);
      setMonthlySalaryDetailsNotFound(isMonthlySalaryEmpty);

      setFormData({
        basicSalary: salaryDetails.basicSalary || '',
        attendanceAllowance: salaryDetails.attendanceAllowance || '',
        transportAllowance: salaryDetails.transportAllowance || '',
        performanceAllowance: salaryDetails.performanceAllowance || '',  
        ot1Rate: salaryDetails.ot1Rate || '',
        ot2Rate: salaryDetails.ot2Rate || '',
        workingHours : salaryDetails.workingHours || '',
        lateChargesPerMin: calculateLateChargesPerMin(salaryDetails.basicSalary || 0, salaryDetails.workingHours || 0),

      });

      setMonthlyData({
        bonus: monthlySalaryDetails.bonus || '',
        incentives: monthlySalaryDetails.incentives || '',
        salaryAdvance: monthlySalaryDetails.salaryAdvance || '',
        foodBill: monthlySalaryDetails.foodBill || '',
        arrears: monthlySalaryDetails.arrears || '',
        otherDeductions: monthlySalaryDetails.otherDeductions || '',
        year: monthlySalaryDetails.year || '',
        month: monthlySalaryDetails.month || '',
      });

    } catch (error) {
      console.error('Error fetching salary details:', error);
      setSalaryDetailsNotFound(true);
    } finally {
      setLoadingSalaryDetails(false);
    }
  },[selectedMonth,selectedYear]);

  useEffect(() => {
    handleEmployeeChange(selectedEmployee);
  }, [selectedMonth,selectedYear,handleEmployeeChange,selectedEmployee]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // Parse updated basicSalary and workingHours
      const basicSalary = parseFloat(name === 'basicSalary' ? value : prevData.basicSalary) || 0;
      const workingHours = parseFloat(name === 'workingHours' ? value : prevData.workingHours) || 0;
  
      // Recalculate lateChargesPerMin when either field changes
      updatedData.lateChargesPerMin = calculateLateChargesPerMin(basicSalary, workingHours);
  
      return updatedData;
    });
  };
  


const handleMonthlyDataChange = (event) => {
  const { name, value } = event.target;
  setMonthlyData((prevData) => {
    return { ...prevData, [name]: value };
  });
};


const calculateLateChargesPerMin = (basicSalary, workingHours) => {
  if (workingHours === 0) {
    return 0; // Avoid division by zero
  }
  let result = basicSalary / (workingHours * 60);
  result = parseFloat(result.toFixed(2)); // Round to 2 decimal places and convert to number
  return result;
};



  const handleSalaryBaseSubmit = async () => {
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

  const handleMonthlySalarySubmit = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee.');
      return;
    }

    try {
      const response = await (monthlySalaryDetailsNotFound
        ? createMonthlySalaryUpdate(selectedEmployee.employeeId,selectedYear, selectedMonth, monthlyData)
        : updateMonthlySalaryUpdate(selectedEmployee.employeeId, selectedYear, selectedMonth, monthlyData));

      if (response.status === 200 || response.status === 201) {
        alert('Monthly salary update submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting monthly salary details:', error);
      alert('An error occurred while submitting monthly salary details. Please try again.');
    }
  };

  const getEmployeeProperty = (property) => selectedEmployee?.[property] || '';

  return (
    <Box className="salary-updates-container">
      <Typography className="salary-updates-header" variant="h4" style={{ marginBottom: '5px' }}>
        Salary Updates
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
          onChange={(event, value) => handleEmployeeChange(value)}
          isOptionEqualToValue={(option, value) => option.employeeId === value?.employeeId}
        />
      )}

      {selectedEmployee && (
        <Box
          className="selected-employee-info"
          mt={1}
          p={2}
          border={1}
          borderRadius={2}
          borderColor="grey.300"
        >
          {['employeeId', 'shortName', 'fullName', 'epfNo'].map((key) => (
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }} key={key}>
              <Typography style={{ fontWeight: 'bold', marginRight: '24px' }}>
                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
              </Typography>
              <Typography>{getEmployeeProperty(key)}</Typography>
            </div>
          ))}
        </Box>
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
            <Box className="employee-form-container" mt={5} p={2}>
              <Grid container spacing={4}>
                {/* Left Column: Salary Base Updates */}
                <Grid item xs={5}>
                  <h3 style={{ marginBottom: '10px' }}>Salary Base Updates</h3>
                  {['basicSalary', 'attendanceAllowance', 'transportAllowance', 'performanceAllowance', 'ot1Rate', 'ot2Rate', 'workingHours', 'lateChargesPerMin'].map((field) => (
                    <Grid container spacing={1} alignItems="center" key={field}>
                      <Grid item xs={5}>
                        <Typography variant="subtitle1">
                          {field === 'lateChargesPerMin'
                            ? 'Late Charges Per Minutes (Calculated)'
                            : field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          name={field}
                          value={formData[field]}
                          onChange={handleFormChange}
                          disabled={field === 'lateChargesPerMin'}
                           size="small"
                           sx={{ marginBottom: '16px' }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    variant="contained"
                    onClick={handleSalaryBaseSubmit}
                    color="primary"
                    sx={{ marginTop: '20px' }}
                  >
                    {salaryDetailsNotFound ? 'Create' : 'Update'} Salary Base Details
                  </Button>
                </Grid>

                {/* Right Column: Monthly Salary Updates */}
                <Grid item xs={7}>
                  <h3 style={{ marginBottom: '10px' }}>Monthly Salary Updates</h3>

                  {/* Year Field */}
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={5}>
                      <Typography variant="subtitle1">Year</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        disabled
                        name="year"
                        value={selectedYear}
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '16px' }}
                      >
                      </TextField>
                    </Grid>
                  </Grid>

                  {/* Month Field */}
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={5}>
                      <Typography variant="subtitle1">Month</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        disabled
                        name="month"
                        value={selectedMonth}
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '16px' }}
                      >
                        
                      </TextField>
                    </Grid>
                  </Grid>

                  {['bonus', 'incentives', 'salaryAdvance', 'foodBill', 'arrears', 'otherDeductions'].map((field) => (
                    <Grid container spacing={1} alignItems="center" key={field}>
                      <Grid item xs={5}>
                        <Typography variant="subtitle1">
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          name={field}
                          value={monthlyData[field]}
                          onChange={handleMonthlyDataChange}
                          size="small"
                          sx={{ marginBottom: '16px' }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    variant="contained"
                    onClick={handleMonthlySalarySubmit}
                    color="primary"
                    sx={{ marginTop: '20px' }}
                  >
                    {monthlySalaryDetailsNotFound ? 'Create' : 'Update'} Monthly Salary Details
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default SalaryBase;
