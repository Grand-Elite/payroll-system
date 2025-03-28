import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  fetchLeaveUsage,
  fetchAttendanceSummary,
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
  const [attendanceSummary,setAttendanceSummary] = useState([]);
  const [leaveData, setLeaveData] = useState({
    annual: 0,
    medical: 0,
    casual: 0,
    abOnPublicHoliday: 0,
    other: 0,
    noPayLeaves: 0,
    monthlyMandatoryLeaves: 0,
    leaveApproval: false,
  });

  const totalLeaves =
    leaveData.annual +
    leaveData.casual +
    leaveData.medical +
    leaveData.abOnPublicHoliday +
    leaveData.other +
    leaveData.noPayLeaves +
    leaveData.monthlyMandatoryLeaves;

  const isEligible = 
      totalLeaves <= 6 && 
      leaveData.noPayLeaves === 0 && 
      leaveData.leaveApproval &&
      attendanceSummary.lateDaysSum <= 3
      ;

  const [formData, setFormData] = useState({
    basicSalary: '',
    attendanceAllowance: '',
    transportAllowance: '',
    performanceAllowance: '',
    encouragementAllowance: '',
    ot1Rate: '',
    ot2Rate: '',
    workingHours: '',
    compulsoryOt1HoursPerDay: '',
    lateChargesPerMin: '0.00',
    compulsoryOt1AmountPerDay: '0.0',
    monthlyTotal: '0.0',
    ot1PerHour: '0.0',
    ot2SatFullDay: '0.0',
  });

  const [monthlyData, setMonthlyData] = useState({
    bonus: '',
    incentives: '',
    monthEncouragementAllowance: '',
    salaryAdvance: '',
    foodBill: '',
    arrears: '',
    otherDeductions: '',
    year: '',
    month: '',
  });

  // Automatically update "monthEncouragementAllowance" based on eligibility
  useEffect(() => {
    if (isEligible) {
      setMonthlyData((prev) => ({
        ...prev,
        monthEncouragementAllowance: formData.encouragementAllowance,
      }));
    } else {
      setMonthlyData((prev) => ({
        ...prev,
        monthEncouragementAllowance: '0',
      }));
    }
  }, [isEligible, formData.encouragementAllowance]);

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

  const handleEmployeeChange = useCallback(
    async (employee) => {
      if (!employee) {
        setSelectedEmployee(null);
        setSalaryDetailsNotFound(false);
        return;
      }

      setSelectedEmployee(employee);
      setLoadingSalaryDetails(true);

      try {
        const salaryDetails = await getSalaryDetailByEmployeeId(employee.employeeId);
        const monthlySalaryDetails = await getMonthlySalaryDetails(employee.employeeId,selectedYear,selectedMonth);
        const leaveUsage = await fetchLeaveUsage(employee.employeeId, selectedYear, selectedMonth);
        const attendanceSummary = await fetchAttendanceSummary(employee.employeeId, selectedYear, selectedMonth);

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
          encouragementAllowance: salaryDetails.encouragementAllowance || '',
          ot1Rate: salaryDetails.ot1Rate || '',
          ot2Rate: salaryDetails.ot2Rate || '',
          workingHours: salaryDetails.workingHours || '',
          compulsoryOt1HoursPerDay: salaryDetails.compulsoryOt1HoursPerDay || '',
          lateChargesPerMin: calculateLateChargesPerMin(
            salaryDetails.basicSalary || 0,
            salaryDetails.workingHours || 0
          ),
          compulsoryOt1AmountPerDay: calculateCompulsoryOt1AmountPerDay(
            salaryDetails.basicSalary || 0,
            salaryDetails.workingHours || 0,
            salaryDetails.ot1Rate || 0,
            salaryDetails.compulsoryOt1HoursPerDay || 0
          ),
          monthlyTotal: calculateMonthlyTotal(
            salaryDetails.basicSalary || 0,
            salaryDetails.performanceAllowance || 0,
            salaryDetails.encouragementAllowance || 0,
            salaryDetails.transportAllowance || 0,
            salaryDetails.attendanceAllowance || 0,
            salaryDetails.compulsoryOt1AmountPerDay || 0
          ),
          ot1PerHour: calculateOt1PerHour(
            salaryDetails.basicSalary || 0,
            salaryDetails.workingHours || 0,
            salaryDetails.ot1Rate || 0
          ),
          ot2SatFullDay: calculateOt2SatFullDay(
            salaryDetails.basicSalary || 0,
            salaryDetails.workingHours || 0,
            salaryDetails.ot2Rate || 0
          ),
        });

        setMonthlyData({
          bonus: monthlySalaryDetails.bonus || '',
          incentives: monthlySalaryDetails.incentives || '',
          monthEncouragementAllowance: isEligible
            ? salaryDetails.encouragementAllowance || ''
            : '0',
          salaryAdvance: monthlySalaryDetails.salaryAdvance || '',
          foodBill: monthlySalaryDetails.foodBill || '',
          arrears: monthlySalaryDetails.arrears || '',
          otherDeductions: monthlySalaryDetails.otherDeductions || '',
          year: monthlySalaryDetails.year || '',
          month: monthlySalaryDetails.month || '',
        });

        if (leaveUsage) {
          setLeaveData({
            annual: leaveUsage.annual || 0,
            medical: leaveUsage.medical || 0,
            casual: leaveUsage.casual || 0,
            abOnPublicHoliday: leaveUsage.abOnPublicHoliday || 0,
            other: leaveUsage.other || 0,
            noPayLeaves: leaveUsage.noPayLeaves || 0,
            monthlyMandatoryLeaves: leaveUsage.monthlyMandatoryLeaves || 0,
            leaveApproval: leaveUsage.leaveApproval || false,
          });
        }

        if (attendanceSummary) {
          setAttendanceSummary({
            lateDaysSum: attendanceSummary.lateDaysSum || '0',
          });
        }

      } catch (error) {
        console.error('Error fetching salary details:', error);
        setSalaryDetailsNotFound(true);
      } finally {
        setLoadingSalaryDetails(false);
      }
    },
    [selectedMonth, selectedYear, isEligible] //monthlyData.monthEncouragementAllowance
  );

  useEffect(() => {
    handleEmployeeChange(selectedEmployee);
  }, [selectedMonth, selectedYear, handleEmployeeChange, selectedEmployee]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // Parse all inputs
      const basicSalary = parseFloat(updatedData.basicSalary) || 0;
      const workingHours = parseFloat(updatedData.workingHours) || 0;
      const ot1Rate = parseFloat(updatedData.ot1Rate) || 0;
      const compulsoryOt1HoursPerDay = parseFloat(updatedData.compulsoryOt1HoursPerDay) || 0;
      const attendanceAllowance = parseFloat(updatedData.attendanceAllowance) || 0;
      const transportAllowance = parseFloat(updatedData.transportAllowance) || 0;
      const performanceAllowance = parseFloat(updatedData.performanceAllowance) || 0;
      const encouragementAllowance = parseFloat(updatedData.encouragementAllowance) || 0;
      const ot2Rate = parseFloat(updatedData.ot2Rate) || 0;
  
      switch (name) {
        case 'basicSalary':
        case 'workingHours':
          updatedData.lateChargesPerMin = calculateLateChargesPerMin(basicSalary, workingHours);
          updatedData.compulsoryOt1AmountPerDay = calculateCompulsoryOt1AmountPerDay(basicSalary, workingHours, ot1Rate, compulsoryOt1HoursPerDay);
          updatedData.ot1PerHour = calculateOt1PerHour(basicSalary, workingHours, ot1Rate);
          updatedData.ot2SatFullDay = calculateOt2SatFullDay(basicSalary, workingHours, ot2Rate);
  
          // Update monthlyTotal after calculating compulsoryOt1AmountPerDay
          updatedData.monthlyTotal = calculateMonthlyTotal(
            basicSalary,
            performanceAllowance,
            encouragementAllowance,
            transportAllowance,
            attendanceAllowance,
            updatedData.compulsoryOt1AmountPerDay
          );
          break;
  
        case 'ot1Rate':
        case 'compulsoryOt1HoursPerDay':
          updatedData.compulsoryOt1AmountPerDay = calculateCompulsoryOt1AmountPerDay(basicSalary, workingHours, ot1Rate, compulsoryOt1HoursPerDay);
  
          // Update monthlyTotal after calculating compulsoryOt1AmountPerDay
          updatedData.monthlyTotal = calculateMonthlyTotal(
            basicSalary,
            performanceAllowance,
            encouragementAllowance,
            transportAllowance,
            attendanceAllowance,
            updatedData.compulsoryOt1AmountPerDay
          );
          break;
  
        case 'attendanceAllowance':
        case 'transportAllowance':
        case 'performanceAllowance':
        case 'encouragementAllowance':  
          // Use the existing value of compulsoryOt1AmountPerDay
          updatedData.monthlyTotal = calculateMonthlyTotal(
            basicSalary,
            performanceAllowance,
            encouragementAllowance,
            transportAllowance,
            attendanceAllowance,
            updatedData.compulsoryOt1AmountPerDay
          );
          break;
  
        case 'ot2Rate':
          updatedData.ot2SatFullDay = calculateOt2SatFullDay(basicSalary, workingHours, ot2Rate);
          break;
  
        default:
          break;
      }
  
      return updatedData;
    });
  };
    
  


  const handleMonthlyDataChange = (event) => {
    event.preventDefault(); // Prevent form submission
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

const calculateCompulsoryOt1AmountPerDay = (basicSalary, workingHours, ot1Rate, compulsoryOt1HoursPerDay) => {
  if (workingHours === 0) {
    return 0; // Avoid division by zero
  }
  let result = ((basicSalary / workingHours )* ot1Rate* compulsoryOt1HoursPerDay);
  result = parseFloat(result.toFixed(2)); // Round to 2 decimal places and convert to number
  return result;
};

const calculateMonthlyTotal = (basicSalary, performanceAllowance, encouragementAllowance, transportAllowance,attendanceAllowance, compulsoryOt1AmountPerDay) => {
  let result = ((basicSalary + performanceAllowance + encouragementAllowance) +(26*(transportAllowance+attendanceAllowance+compulsoryOt1AmountPerDay)));
  result = parseFloat(result.toFixed(2)); // Round to 2 decimal places and convert to number
  return result;
};

const calculateOt1PerHour = (basicSalary, workingHours,ot1Rate) => {
  if (workingHours === 0) {
    return 0; // Avoid division by zero
  }
  let result = ((basicSalary/workingHours)*ot1Rate);
  result = parseFloat(result.toFixed(2)); // Round to 2 decimal places and convert to number
  return result;
};

const calculateOt2SatFullDay = (basicSalary, workingHours,ot2Rate) => {
  if (workingHours === 0) {
    return 0; // Avoid division by zero
  }
  let result = ((basicSalary/workingHours)*ot2Rate*3);
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
          toast.success('Updated successfully!');
        }
      } else {
        const response = await updateSalaryDetails(selectedEmployee.employeeId, formData);
        if (response.status === 200) {
          toast.success('Updated successfully!');
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
        toast.success('Updated successfully!');
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
                                <p style={{ 
                                    color: isEligible ? "green" : "red", 
                                    margin: "20px 0", // Adds space above and below
                                    fontWeight: "bold" // Optional: Makes it stand out
                                }}>
                                 Encouragement Allowance Eligibility for {selectedMonth} : {isEligible ? "Yes" : "No"}
                                </p>

                                {['basicSalary', 'attendanceAllowance', 'transportAllowance', 'performanceAllowance', 'encouragementAllowance', 'ot1Rate', 'ot2Rate', 'workingHours', 'compulsoryOt1HoursPerDay', 'lateChargesPerMin', 'compulsoryOt1AmountPerDay', 'monthlyTotal', 'ot1PerHour', 'ot2SatFullDay'].map((field) => (
                <Grid container spacing={1} alignItems="center" key={field}>
                  <Grid item xs={5}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: field === 'encouragementAllowance' ? (isEligible ? 'green' : 'red') : 'inherit', // Change label color for this field
                        fontWeight: field === 'encouragementAllowance' ? 'bold' : 'normal', // Optional: Make the label bold
                      }}
                    >
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
                      disabled={
                        field === 'lateChargesPerMin' ||
                        field === 'monthlyTotal' ||
                        field === 'compulsoryOt1AmountPerDay' ||
                        field === 'ot1PerHour' ||
                        field === 'ot2SatFullDay'
                      }
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

                  {
                  ['bonus', 'incentives', 'monthEncouragementAllowance', 'salaryAdvance', 'foodBill', 'arrears', 'otherDeductions']
                  .map((field) => (
                      <Grid container spacing={1} alignItems="center" key={field}>
                        <Grid item xs={5}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: field === 'monthEncouragementAllowance' ? (isEligible ? 'green' : 'red') : 'inherit', // Change label color for this field
                              fontWeight: field === 'monthEncouragementAllowance' ? 'bold' : 'normal', // Optional: Make the label bold
                            }}
                          >
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
                            //disabled={field === 'monthEncouragementAllowance' && !isEligible} // Disable if not eligible
                            //disabled={field === 'monthEncouragementAllowance'}
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
                    <ToastContainer/>
                  </Button>
                </Grid>
                <Button
                  variant="contained"
                  onClick={handleMonthlySalarySubmit}
                  sx={{
                    marginTop: '20px',
                    backgroundColor: 'green',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  Recalculate Monthly Salary
                  <ToastContainer />
                </Button>
              </Grid>
            </Box>  
          )}
        </>
      )}
    </Box>
  );
}

export default SalaryBase;