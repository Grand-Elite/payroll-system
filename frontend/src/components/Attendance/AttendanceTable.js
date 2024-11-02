import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { fetchAttendance } from '../../services/api';


function AttendanceTable(props) {
    const [daysInMonth, setDaysInMonth] = useState([]);
  
    // Get all days of the current month
    useEffect(() => {
      const currentMonth = dayjs().month()-1; // get the current month (0-indexed)
      const currentYear = dayjs().year(); // get the current year
      const days = [];
      const daysInCurrentMonth = dayjs().daysInMonth(); // number of days in the current month
  
      // Create an array of days for the current month
      for (let i = 1; i <= daysInCurrentMonth; i++) {
        const date = dayjs(new Date(currentYear, currentMonth, i));
        const dayOfWeek = date.day(); // day of the week (0 = Sunday, 6 = Saturday)
        days.push({
          date: date.format('YYYY-MM-DD'),
          day: date.format('dddd'),
          dayOfWeek,
          timeIn: '',
          timeOut: '',
          attendanceStatus: '',
          workHours: '',
          leaveType: '',
        });
      }
  
      setDaysInMonth(days); // Set the days in the current month
  
      // Load employee attendance after setting up the days
      const loadEmployeeAttendance = async () => {
        try {
          const employeeAttendanceList = await fetchAttendance(props.employeeId);
          
          // Create a lookup map for quick access by date
          const attendanceMap = {};
          employeeAttendanceList.forEach(record => {
              attendanceMap[record.date] = record;
          });
          // Update daysInMonth using the attendance map
          const updatedDays = days.map(day => {
              const attendanceRecord = attendanceMap[day.date];
              if (attendanceRecord) {
                  return {
                      ...day,
                      timeIn: attendanceRecord.actualStartTime || '',
                      timeOut: attendanceRecord.actualEndTime || '',
                      attendanceStatus: attendanceRecord.attendanceStatus || '',
                      workHours: attendanceRecord.workHours || '',
                      leaveType: attendanceRecord.leaveType || '',
                  };
              }
              return day;
          });

          setDaysInMonth(updatedDays); // Update the state with the fetched data
        } catch (error) {
          console.error("Error fetching employee attendance:", error);
        }
      };
  
      loadEmployeeAttendance();
    }, [props.employeeId]);
  
    // Handle change for attendance fields
    const handleFieldChange = (index, field, value) => {
      const updatedDays = [...daysInMonth];
      updatedDays[index][field] = value;
      setDaysInMonth(updatedDays);
    };

  return (
    <TableContainer component={Paper} style={{ maxWidth: 800, margin: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time In</TableCell>
            <TableCell>Time Out</TableCell>
            <TableCell>Attendance Status</TableCell>
            <TableCell>Work Hours</TableCell>
            <TableCell>Leave Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {daysInMonth.map((day, index) => (
            <TableRow
              key={index}
              style={{
                backgroundColor:
                  day.dayOfWeek === 0 || day.dayOfWeek === 6 ? '#f5f5f5' : 'inherit', // Different color for weekends
              }}
            >
              <TableCell>
                <Typography>{day.date} ({day.day})</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  value={dayjs(day.timeIn).format("HH:mm:ss")}
                  onChange={(e) => handleFieldChange(index, 'timeIn', e.target.value)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  value={dayjs(day.timeOut).format("HH:mm:ss")}
                  onChange={(e) => handleFieldChange(index, 'timeOut', e.target.value)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={day.attendanceStatus}
                  onChange={(e) => handleFieldChange(index, 'attendanceStatus', e.target.value)}
                  size="small"
                  inputProps={{ min: 0, max: 1, step: 0.5 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={day.workHours}
                  onChange={(e) => handleFieldChange(index, 'workHours', e.target.value)}
                  size="small"
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={day.leaveType}
                  onChange={(e) => handleFieldChange(index, 'leaveType', e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="full day leave">Full Day Leave</MenuItem>
                  <MenuItem value="half day leave">Half Day Leave</MenuItem>
                  <MenuItem value="no pay leave">No Pay Leave</MenuItem>
                  <MenuItem value="holiday">Holiday</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;
