import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Autocomplete,
  Button,
} from '@mui/material';
import {
  fetchEmployees,
  getMonthlyFullSalary,
  getPaySheet,
  getAllPaySheets
} from '../../services/api';

function MonthlySalary({ selectedMonth, selectedYear }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
    const [salaryDetailsNotFound, setSalaryDetailsNotFound] = useState(false);

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
      foodBill: '',
      noPayAmount: '',
      arrears:'',
      totalForEpf:'',
      bonus:'',
      grossPay:'',
      incentives: '',
      totalAllowance: '',
      lateCharges: '',
      otherDeductions: '',
      totalDeduction: '',
      epfCompanyAmount: '',
      epfTotal: '',
      etfCompanyAmount: '',

    });


    const fieldLabelMap = {
      basic: "Basic Salary",
      attendanceAllowance: "Attendance Allowance",
      transportAllowance: "Transport Allowance",
      performanceAllowance: "Performance Allowance",
      ot1: "OT-1 Amount", 
      ot2: "OT-2 Amount",
      totalMonthlySalary: "Total Monthly Salary",
      epfEmployeeAmount: "EPF 8% employee Amount",
      salaryAdvance: "Salary Advance",
      netSalary: "Net Salary",
      foodBill: "Food Bill",
      noPayAmount: "No Pay Amount",
      arrears: "Arrears",
      totalForEpf: "Total For EPF",
      bonus: 'Bonus',
      grossPay: 'Gross Pay',
      incentives: "Incentives",
      totalAllowance: "Total Allowance",
      lateCharges: "Late Charges",
      otherDeductions: "Other Deduction",
      totalDeduction: "Total Deduction",
      epfCompanyAmount: "EPF 12% Company Contribution",
      epfTotal: "EPF Total",
      etfCompanyAmount: "ETF 3% Company Contribution"
    };

    

    const getEmployeeProperty = (property) => selectedEmployee?.[property] || '';

    const handleDownloadPaysheet = async () => {
      const pdfBlob = await getPaySheet(selectedEmployee.employeeId, selectedYear, selectedMonth);
      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `pay-sheet-${selectedEmployee.shortName}-${selectedYear}-${selectedMonth}.pdf`; // Suggested filename
      link.click();

      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    }

    const handleDownloadAllPaysheets = async () => {
      const pdfBlob = await getAllPaySheets(selectedYear, selectedMonth);
      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `all-pay-sheets-${selectedYear}-${selectedMonth}.pdf`; 
      link.click();

      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    }

    // Memoize handleEmployeeChange to avoid redefinition on every render
    const handleEmployeeChange = useCallback(async (employee) => {
        if (!employee) {
          setSelectedEmployee(null);
          setSalaryDetailsNotFound(false);
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
            noPayAmount: salaryDetails.noPayAmount ?? '0',
            arrears:  salaryDetails.arrears ?? '0',
            totalForEpf: salaryDetails.totalForEpf ?? '0',
            bonus: salaryDetails.bonus ?? '0',
            ot1: salaryDetails.ot1 ?? '0',
            ot2: salaryDetails.ot2 ?? '0',
            grossPay: salaryDetails.grossPay ?? '0',
            attendanceAllowance: salaryDetails.attendanceAllowance ?? '0',
            transportAllowance: salaryDetails.transportAllowance ?? '0',
            performanceAllowance: salaryDetails.performanceAllowance ?? '0',
            incentives: salaryDetails.incentives ?? '0',  
            totalAllowance: salaryDetails.totalAllowance ?? '0',
            totalMonthlySalary: salaryDetails.totalMonthlySalary ?? '0',
            epfEmployeeAmount: salaryDetails.epfEmployeeAmount ?? '0',
            salaryAdvance: salaryDetails.salaryAdvance ?? '0',           
            lateCharges: salaryDetails.lateCharges ?? '0',
            otherDeductions: salaryDetails.otherDeductions ?? '0',
            foodBill: salaryDetails.foodBill ?? '0',
            totalDeduction: salaryDetails.totalDeduction ?? '0',
            netSalary: salaryDetails.netSalary ?? '0',
            epfTotal: salaryDetails.epfTotal ?? '0',
            epfCompanyAmount: salaryDetails.epfCompanyAmount ?? '0',
            etfCompanyAmount: salaryDetails.etfCompanyAmount ?? '0',
          });
          
        } catch (error) {
          console.error('Error fetching salary details:', error);
          setSalaryDetailsNotFound(true);
        } finally {
          setLoadingSalaryDetails(false);
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
          Monthly Salary
        </Typography>
        <Button variant="contained"
          onClick={handleDownloadAllPaysheets}
          color="primary"
          >Download All Pay Sheets</Button>
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
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Typography style={{ fontWeight: 'bold', marginRight: '64px' }}>EPF No:</Typography>
              <Typography>{getEmployeeProperty('epfNo')}</Typography>
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
          <Button variant="contained"
          onClick={handleDownloadPaysheet}
          color="primary"
          >Download Pay Sheet</Button>
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
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontWeight: field === "totalMonthlySalary" || field === "netSalary" ? "bold" : "normal",
                        fontSize: field === "totalMonthlySalary" || field === "netSalary" ? "1.1rem" : "1rem",
                      }}
                    >
                      {fieldLabelMap[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </Typography>
                  </Grid>

                  <Grid item xs={9}>
                    <Typography
                      variant="body1"
                      style={{
                        marginTop: '8px',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        fontWeight: field === "totalMonthlySalary" || field === "netSalary" ? "bold" : "normal",
                        fontSize: field === "totalMonthlySalary" || field === "netSalary" ? "1.1rem" : "1rem",
                      }}
                    >
                      <span style={{ marginRight: '20px' }}>Rs.</span>
                      <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'right' }}>
                        {(parseFloat(formData[field] || '0')).toFixed(2)}
                      </span>
                    </Typography>
                  </Grid>

                  {/* Conditionally Render Line */}
                  <Grid item xs={12}>
                    <hr
                      style={{
                        border: 'none',
                        borderTop:
                          field === "grossPay" ||
                          field ==="ot2"  ||
                          field === "totalAllowance" ||
                          field === "totalMonthlySalary" ||
                          field === "totalDeduction" ||
                          field === "netSalary"
                            ? '2px solid black' 
                            : '1px dashed gray', 
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