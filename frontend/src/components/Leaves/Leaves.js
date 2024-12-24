import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Autocomplete,
  Button,
} from '@mui/material';
import {
  fetchEmployees,
  fetchLeaveDetails,
  saveLeaveDetails,
} from '../../services/api';

import './Leaves.css';

function Leaves({ selectedYear }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);
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
          const details = await fetchLeaveDetails(selectedEmployee.employeeId, selectedYear);

          // If the API returns an empty response, handle it
          if (!details || Object.keys(details).length === 0) {
            setLeaveDetails({ annual: 0, casual: 0, medical: 0 });
            alert(`No leave details found for ${selectedEmployee.shortName} in ${selectedYear}.`);
          } else {
            setLeaveDetails(details);
          }
        } catch (error) {
          // Handle any errors from the API call
          console.error('Error fetching leave details:', error);
          alert(`Failed to fetch leave details for ${selectedEmployee.shortName} in ${selectedYear}. Please try again.`);
        }
      }
    };

    loadLeaveDetails();
  }, [selectedEmployee, selectedYear]);

  const handleEmployeeChange = (value) => {
    setSelectedEmployee(value);
    setError('');
    setLeaveDetails(null); // Reset leave details for new employee
  };

  const handleInputChange = (field, value) => {
    setLeaveDetails((prev) => ({ ...prev, [field]: parseInt(value, 10) || 0 }));
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
          {['Year', 'Annual', 'Casual', 'Medical'].map((label) => (
            <Box key={label} display="flex" alignItems="center" marginBottom={2}>
              <Typography style={{ fontWeight: 'bold', minWidth: '150px' }}>
                {label}:
              </Typography>
              <TextField
                label={label}
                value={
                  label === 'Year' ? selectedYear : leaveDetails[label.toLowerCase()] || 0
                }
                onChange={(e) =>
                  label !== 'Year' && handleInputChange(label.toLowerCase(), e.target.value)
                }
                variant="outlined"
                margin="normal"
                size="small"
                style={{ maxWidth: 'calc(50% - 16px)' }}
              />
              {/* Show Remaining Leaves for Annual, Casual, and Medical */}
              {label !== 'Year' && (
                <Typography style={{ marginLeft: '16px', fontWeight: 'normal' }}>
                  Remaining Leaves: {}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

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
    </Box>
  );
}

export default Leaves;
