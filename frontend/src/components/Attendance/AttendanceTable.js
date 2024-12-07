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
import OTHoursCell from './OTHoursCell';
import LateHoursCell from './LateHoursCell';
import { formatHourMins } from '../../util/DateTimeUtil';

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
        shift: '',
        otMins: 0,
        otEarlyClockinMins: 0,
        updatedOtEarlyClockinMins: 0,
        otLateClockoutMins:0,
        updatedOtLateClockoutMins:0,
        originalOtMins: 0,
        lateMins: 0,
        lcLateClockinMins: 0,
        updatedLcLateClockinMins: 0,
        lcEarlyClockoutMins: 0,
        updatedLcEarlyClockoutMins: 0,
        originalLateMins: 0,
        overwritten: '',
      });
    }

    setDaysInMonth(days);

    const loadEmployeeAttendance = async () => {
      try {
        const employeeAttendanceList = await fetchAttendance(props.employeeId,props.selectedYear,props.selectedMonth);
        
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
                  attendanceRecordId: attendanceRecord.attendanceRecordId,
                  timeIn: attendanceRecord.actualStartTime || '',
                  timeOut: attendanceRecord.actualEndTime || '',
                  attendanceStatus: attendanceRecord.overwrittenAttendanceStatus?
                                    attendanceRecord.overwrittenAttendanceStatus.updatedAttendanceStatus:null 
                                    || attendanceRecord.attendance || '',
                  originalAttendanceStatus: attendanceRecord.overwrittenAttendanceStatus?
                                            attendanceRecord.overwrittenAttendanceStatus.updatedAttendanceStatus:null 
                                            || attendanceRecord.attendance || '',
                  workMins: attendanceRecord.workMins || 0,
                  shift: attendanceRecord.shift.shiftPeriod || 'MORNING',
      
                  otMins: attendanceRecord.overwrittenAttendanceStatus?
                          attendanceRecord.overwrittenAttendanceStatus.updatedTotalOtMins:null 
                          ||attendanceRecord.otMins || 0,
                  originalOtMins: attendanceRecord.overwrittenAttendanceStatus?
                                  attendanceRecord.overwrittenAttendanceStatus.updatedTotalOtMins:null 
                                  ||attendanceRecord.otMins || 0,
                  otEarlyClockinMins: attendanceRecord.overwrittenAttendanceStatus?
                                      attendanceRecord.overwrittenAttendanceStatus.updatedOtEarlyClockinMins:null 
                                      || attendanceRecord.otEarlyClockinMins || 0,
                  updatedOtEarlyClockinMins: attendanceRecord.overwrittenAttendanceStatus?
                                              attendanceRecord.overwrittenAttendanceStatus.updatedOtEarlyClockinMins:null 
                                            || attendanceRecord.otEarlyClockinMins || 0,
                  otLateClockoutMins: attendanceRecord.overwrittenAttendanceStatus?
                                      attendanceRecord.overwrittenAttendanceStatus.updatedOtLateClockoutMins:null 
                                      || attendanceRecord.otLateClockoutMins || 0,
                  updatedOtLateClockoutMins: attendanceRecord.overwrittenAttendanceStatus?
                                              attendanceRecord.overwrittenAttendanceStatus.updatedOtLateClockoutMins:null 
                                            || attendanceRecord.otLateClockoutMins || 0,
      
                  lateMins: attendanceRecord.overwrittenAttendanceStatus?
                            attendanceRecord.overwrittenAttendanceStatus.updatedTotalLcMins:null 
                            || attendanceRecord.lcMins || '',
                  originalLateMins: attendanceRecord.overwrittenAttendanceStatus?
                                    attendanceRecord.overwrittenAttendanceStatus.updatedTotalLcMins:null 
                                  || attendanceRecord.lcMins || '',
                  lcLateClockinMins: attendanceRecord.overwrittenAttendanceStatus?
                                      attendanceRecord.overwrittenAttendanceStatus.updatedLcLateClockinMins:null 
                                      ||attendanceRecord.lcLateClockinMins || 0,
                  updatedLcLateClockinMins: attendanceRecord.overwrittenAttendanceStatus?
                                            attendanceRecord.overwrittenAttendanceStatus.updatedLcLateClockinMins:null 
                                            ||attendanceRecord.lcLateClockinMins || 0,
                  lcEarlyClockoutMins: attendanceRecord.overwrittenAttendanceStatus?
                                        attendanceRecord.overwrittenAttendanceStatus.updatedLcEarlyClockoutMins:null 
                                        ||attendanceRecord.lcEarlyClockoutMins || 0,
                  updatedLcEarlyClockoutMins: attendanceRecord.overwrittenAttendanceStatus?
                                              attendanceRecord.overwrittenAttendanceStatus.updatedLcEarlyClockoutMins:null 
                                              ||attendanceRecord.lcEarlyClockoutMins || 0,
      
                  overwritten: attendanceRecord.overwrittenAttendanceStatus?'*':'',
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
  if (
    day.attendanceStatus !== day.originalAttendanceStatus ||
    day.updatedOtEarlyClockinMins !== day.otEarlyClockinMins ||
    day.updatedOtLateClockoutMins !== day.otLateClockoutMins ||
    day.updatedLcLateClockinMins !== day.lcLateClockinMins ||
    day.updatedLcEarlyClockoutMins !== day.lcEarlyClockoutMins ||
    day.lateMins !== day.originalLateMins||
    day.otMins !== day.originalOtMins
  ) {
    try {
      await updateAttendanceStatus(
        props.employeeId,
        day.date,
        day.attendanceRecordId,
        day.attendanceStatus,
        day.updatedLcEarlyClockoutMins,
        day.updatedLcLateClockinMins,
        day.updatedOtEarlyClockinMins,
        day.updatedOtLateClockoutMins,
        day.lateMins,
        day.otMins
      );

      // Update the original values to ensure consistency:
      const updatedDays = [...daysInMonth];
      updatedDays[index] = {
        ...day,
        originalAttendanceStatus: day.attendanceStatus,
        otEarlyClockinMins: day.updatedOtEarlyClockinMins,
        otLateClockoutMins: day.updatedOtLateClockoutMins,
        lcLateClockinMins: day.updatedLcLateClockinMins,
        lcEarlyClockoutMins: day.updatedLcEarlyClockoutMins,
        originalLateMins: day.lateMins,
        originalOtMins: day.otMins
      };
      setDaysInMonth(updatedDays);
      alert('Attendance record updated successfully');
    } catch (error) {
      console.error('Error updating attendance record:', error);
      alert('Failed to update attendance record');
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
            <TableCell>Work Hours</TableCell>
            <TableCell>Shift</TableCell>
            <TableCell>OT Hours</TableCell>
            <TableCell>Late Hours</TableCell>
            <TableCell>Attendance Status</TableCell>
            {/* <TableCell>Leave Type</TableCell> */}
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
                <TextField
                  value={formatHourMins(day.workMins)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                  <Select
                      value={day.shift}
                      onChange={(e) => handleFieldChange(index, "shift", e.target.value)}
                      size="small"
                      displayEmpty
                  >
                      <MenuItem value="MORNING">M</MenuItem>
                      <MenuItem value="EVENING">E</MenuItem>
                  </Select>
                </TableCell>
              <OTHoursCell 
              day={day} 
              index={index} 
              handleFieldChange={handleFieldChange} />

              <LateHoursCell 
              day={day} 
              index={index} 
              handleFieldChange={handleFieldChange} />


              <TableCell>
                  <Select
                      value={day.attendanceStatus}
                      onChange={(e) => handleFieldChange(index, "attendanceStatus", e.target.value)}
                      size="small"
                      displayEmpty
                  >
                      <MenuItem value="ab">ab</MenuItem>
                      <MenuItem value="ab-nopay">ab-nopay</MenuItem>
                      <MenuItem value="0.5">0.5</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                  </Select>
                </TableCell>
              {/* <TableCell>
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
              </TableCell> */}
              <TableCell>
                  {/* Only show the save button if the status has changed */}
                  {(day.attendanceStatus !== day.originalAttendanceStatus 
                  || day.otMins !== day.originalOtMins 
                  || day.lateMins !== day.originalLateMins )
                  && (
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