import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Autocomplete,
  Button,
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody 
} from '@mui/material';
import {
  fetchEmployees,
  fetchLeaveDetails,
  saveLeaveDetails,
  fetchYearlyLeaveUsage,
} from '../../services/api';

import './Leaves.css';

function Leaves({ selectedYear }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [yearlyLeaveUsage, setYearlyLeaveUsage] = useState({
    annual: 0,
    casual: 0,
    medical: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load employee data on mount
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const employeeList = await fetchEmployees();
        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employees. Please try again later.');
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmployees();
  }, []);

  // Fetch leave details when an employee is selected
  useEffect(() => {
    const loadLeaveDetails = async () => {
      if (selectedEmployee && selectedYear) {
        try {
          const details = await fetchLeaveDetails(
            selectedEmployee.employeeId,
            selectedYear
          );
          setLeaveDetails(details || { annual: 0, casual: 0, medical: 0 });
        } catch (error) {
          console.error('Error fetching leave details:', error);
          alert(
            `Failed to fetch leave details for ${selectedEmployee.shortName} in ${selectedYear}. Please try again.`
          );
        }
      }
    };

    loadLeaveDetails();
  }, [selectedEmployee, selectedYear]);

  // Fetch yearly leave usage when an employee is selected
  useEffect(() => {
    const loadYearlyLeaveUsage = async () => {
      if (selectedEmployee && selectedYear) {
        try {
          const details = await fetchYearlyLeaveUsage(
            selectedEmployee.employeeId,
            selectedYear
          );
          setYearlyLeaveUsage(details || { annual: 0, casual: 0, medical: 0 });
        } catch (error) {
          console.error('Error fetching yearly leave usage:', error);
          alert(
            `Failed to fetch yearly leave usage for ${selectedEmployee.shortName} in ${selectedYear}. Please try again.`
          );
        }
      }
    };

    loadYearlyLeaveUsage();
  }, [selectedEmployee, selectedYear]);

  const handleEmployeeChange = (value) => {
    setSelectedEmployee(value);
    setError('');
    setLeaveDetails(null);
    setYearlyLeaveUsage({ annual: 0, casual: 0, medical: 0 });
  };

  const handleInputChange = (field, value) => {
    setLeaveDetails((prev) => ({
      ...prev,
      [field]: parseInt(value, 10) || 0,
    }));
  };

  const handleSave = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee before saving.');
      return;
    }

    setSaving(true);
    try {
      const saveData = {
        employeeId: selectedEmployee.employeeId,
        year: selectedYear,
        ...leaveDetails,
      };
      await saveLeaveDetails(saveData);
      alert('Leave details saved successfully!');
    } catch (error) {
      console.error('Error saving leave details:', error);
      alert('Failed to save leave details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="leaves-container">
      <Typography className="leaves-header" variant="h4" style={{ marginBottom: '5px' }}>
        Leaves
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
        <Box className="selected-employee-info" mt={1} p={2} border={1} borderRadius={2} borderColor="grey.300">
          {['employeeId', 'shortName', 'fullName', 'epfNo'].map((key) => (
            <Box key={key} display="flex" alignItems="center" marginBottom="8px">
              <Typography style={{ fontWeight: 'bold', minWidth: '150px' }}>
                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
              </Typography>
              <Typography>{selectedEmployee[key]}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {error && (
        <Typography color="error" style={{ marginTop: '16px' }}>
          {error}
        </Typography>
      )}

{leaveDetails && (
  <Box mt={2}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Typography style={{ fontWeight: 'bold' }}>Leave Type</Typography></TableCell>
          <TableCell><Typography style={{ fontWeight: 'bold' }}>Leave Details</Typography></TableCell>
          <TableCell><Typography style={{ fontWeight: 'bold' }}>Utilized</Typography></TableCell>
          <TableCell><Typography style={{ fontWeight: 'bold' }}>Remaining</Typography></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {['Annual', 'Casual', 'Medical'].map((label) => (
          <TableRow key={label}>
            <TableCell>
              <Typography>{label}</Typography>
            </TableCell>
            <TableCell>
              <TextField
                label={label}
                value={leaveDetails[label.toLowerCase()] || 0}
                onChange={(e) =>
                  handleInputChange(label.toLowerCase(), e.target.value)
                }
                variant="outlined"
                size="small"
                style={{ maxWidth: '100px' }}
              />
            </TableCell>
            <TableCell>
              <Typography>
                {yearlyLeaveUsage[label.toLowerCase()] || 0}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                {leaveDetails[label.toLowerCase()] - yearlyLeaveUsage[label.toLowerCase()] || 0}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)}

      {selectedEmployee && (
        <Button
          variant="contained"
          color="primary"
          style={{
            marginTop: '16px',
            width: '100px',
            marginLeft: '10px',
            marginRight: 'auto',
          }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
)}
    </Box>
  );
}

export default Leaves;
