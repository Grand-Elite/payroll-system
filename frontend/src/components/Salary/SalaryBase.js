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
import MenuItem from '@mui/material/MenuItem';
import {
  fetchEmployees,
  getSalaryDetailByEmployeeId,
  updateSalaryDetails,
  createSalaryDetails,
} from '../../services/api';
import './SalaryBase.css';

function SalaryBase() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
  const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

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
    lateChargesPerMin: '0.00', // Default late charges per minute
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

  const handleEmployeeChange = async (employee) => {
    if (!employee) {
      setSelectedEmployee(null);
      setSalaryDetailsNotFound(false);
      return;
    }

    setSelectedEmployee(employee);
    setLoadingSalaryDetails(true);

    try {
      const salaryDetails = await getSalaryDetailByEmployeeId(employee.employeeId);

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
        lateChargesPerMin: calculateLateChargesPerMin(salaryDetails.basicSalary || 0),
      });
    } catch (error) {
      console.error('Error fetching salary details:', error);
      setSalaryDetailsNotFound(true);
    } finally {
      setLoadingSalaryDetails(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === 'basicSalary') {
        const basicSalary = parseFloat(value) || 0;
        updatedData.lateChargesPerMin = calculateLateChargesPerMin(basicSalary);
      }

      return updatedData;
    });
  };

  const calculateLateChargesPerMin = (basicSalary) => {
    return (basicSalary / (8 * 60 * 30)).toFixed(2);
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

      {selectedEmployee ? (
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
<Box className="employee-form-container" mt={5} p={2}>
  <Grid container spacing={4}>
    {/* Left Column */}
    <Grid item xs={5}>
  <h3 style={{ marginBottom: '10px' }}>Salary Base Updates</h3>
  {['basicSalary', 'ot1Rate', 'ot2Rate', 'lateChargesPerMin'].map((field) => (
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
          name={field}
          value={formData[field]}
          onChange={field === 'lateChargesPerMin' ? undefined : handleFormChange}
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          InputProps={{
            readOnly: field === 'lateChargesPerMin',
            style: { color: field === 'lateChargesPerMin' ? 'gray' : 'black' },
          }}
          sx={{ width: '85%' , '& .MuiInputBase-input': { color: 'gray' } }} 
        />
      </Grid>
    </Grid>
  ))}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Grid>

    {/* Right Column */}
    <Grid item xs={5} >
    <h3 style={{ marginBottom: '10px' }}>Monthly Salary Updates</h3>
      {/* Year Dropdown */}
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={5}>   
          <Typography variant="subtitle1">Year</Typography>
        </Grid>
        <Grid item xs={7}>
          <TextField
            select
            name="year"
            value={formData.year || ''}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            margin="normal"
            size="small"
            sx={{ width: '85%' }}
          >
      {years.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Month Dropdown */}
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={5}>
          <Typography variant="subtitle1">Month</Typography>
        </Grid>
        <Grid item xs={7}>
          <TextField
            select
            name="month"
            value={formData.month || ''}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            margin="normal"
            size="small"
            sx={{ width: '85%' }}
          >
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {[
        'bonus',
        'attendanceAllowance',
        'transportAllowance',
        'performanceAllowance',
        'incentives',
        'salaryAdvance',
        'foodBill',
        'arrears',
        'otherDeductions',
      ].map((field) => (
        <Grid container spacing={1} alignItems="center" key={field}>
          <Grid item xs={5}>
            <Typography variant="subtitle1">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              name={field}
              value={formData[field]}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ width: '85%', '& .MuiInputBase-input': { color: 'gray' } }} 
            />
          </Grid>
        </Grid>
      ))}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
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
