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
  Button,
} from '@mui/material';
import dayjs from 'dayjs';
import { fetchAttendance, updateAttendanceStatus } from '../../services/api'; // Ensure your api service has the updateAttendanceStatus method

function AttendanceTable(props) {
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const currentMonth = dayjs(`01 ${props.selectedMonth} 2000`, "DD MMMM YYYY").month(); 
    const currentYear = props.selectedYear;
    const days = [];
    const daysInCurrentMonth = dayjs().daysInMonth();

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = dayjs(new Date(currentYear, currentMonth, i));
      const dayOfWeek = date.day();
      days.push({
        date: date.format('YYYY-MM-DD'),
        day: date.format('dddd'),
        dayOfWeek,
        timeIn: '',
        timeOut: '',
        attendanceStatus: 'ab',
        originalAttendanceStatus: 'ab', // Store the original status
        workHours: '',
        leaveType: '',
      });
    }

    setDaysInMonth(days);

    const loadEmployeeAttendance = async () => {
      try {
        const employeeAttendanceList = await fetchAttendance(props.employeeId);
        
        const attendanceMap = {};
        employeeAttendanceList.forEach(record => {
            attendanceMap[record.date] = record;
        });
        console.log(attendanceMap)
        const updatedDays = days.map(day => {
            const attendanceRecord = attendanceMap[day.date];
            if (attendanceRecord) {
                return {
                    ...day,
                    attendanceRecordId:attendanceRecord.attendanceRecordId,
                    timeIn: attendanceRecord.actualStartTime || '',
                    timeOut: attendanceRecord.actualEndTime || '',
                    attendanceStatus: attendanceRecord.attendance || '',
                    originalAttendanceStatus: attendanceRecord.attendance || '', 
                    workHours: attendanceRecord.workHours || '',
                    leaveType: attendanceRecord.leaveType || '',
                };
            }
            return day;
        });
        setDaysInMonth(updatedDays);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    loadEmployeeAttendance();
  }, [props.employeeId, props.selectedMonth, props.selectedYear]);

  const handleFieldChange = (index, field, value) => {
    const updatedDays = [...daysInMonth];
    updatedDays[index][field] = value;

    // If the attendance status is changed, set the new status
    if (field === 'attendanceStatus') {
        updatedDays[index].attendanceStatus = value;
    }

    setDaysInMonth(updatedDays);
};

/* WORKING HANDLE SAVE FUNCTION
  const handleSave = async (index) => {
    const day = daysInMonth[index];
    if (day.attendanceStatus !== day.originalAttendanceStatus) {
        try {
            await updateAttendanceStatus(props.employeeId,day.date, day.attendanceStatus);
            // Update the original status after saving
            const updatedDays = [...daysInMonth];
            updatedDays[index].originalAttendanceStatus = day.attendanceStatus;
            setDaysInMonth(updatedDays);
            alert('Attendance status updated successfully');
        } catch (error) {
            console.error('Error updating attendance status:', error);
            alert('Failed to update attendance status');
        }
    }
};
*/

const handleSave = async (index) => {
  const day = daysInMonth[index];
  if (day.attendanceStatus !== day.originalAttendanceStatus) {
      try {
          await updateAttendanceStatus(day.attendanceRecordId, day.attendanceStatus);
          // Update the original status after saving
          const updatedDays = [...daysInMonth];
          updatedDays[index].originalAttendanceStatus = day.attendanceStatus;
          setDaysInMonth(updatedDays);
          alert('Attendance status updated successfully');
      } catch (error) {
          console.error('Error updating attendance status:', error);
          alert('Failed to update attendance status');
      }
  }
};






  return (
    <TableContainer component={Paper} style={{ margin: 'auto' }}>
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
                  day.dayOfWeek === 0 || day.dayOfWeek === 6 ? '#f5f5f5' : 'inherit',
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
                  <Select
                      value={day.attendanceStatus}
                      onChange={(e) => handleFieldChange(index, "attendanceStatus", e.target.value)}
                      size="small"
                      displayEmpty
                  >
                      <MenuItem value="ab">ab</MenuItem>
                      <MenuItem value="0.5">0.5</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                  </Select>
                </TableCell>

              <TableCell>
                <TextField
                  value={day.workHours}
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
              <TableCell>
                  {/* Only show the save button if the status has changed */}
                  {day.attendanceStatus !== day.originalAttendanceStatus && (
                      <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSave(index)}
                      >
                          Save
                      </Button>
                  )}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;