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
  Box
} from '@mui/material';
import dayjs from 'dayjs';
import { 
  fetchAttendance, 
  updateAttendanceStatus,
  fetchAttendanceSummary, 
  saveLeaveUsage , 
  fetchLeaveDetails,
  fetchLeaveUsage, 
  fetchYearlyLeaveUsage,
} from '../../services/api'; 

import OTHoursCell from './OTHoursCell';
import LateHoursCell from './LateHoursCell';
import { formatHourMins } from '../../util/DateTimeUtil';
import './Attendance.css';

function AttendanceTable(props) {
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [attendanceSummary,setAttendanceSummary] = useState([]);
  const [saving, setSaving] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState(null);

  const [leaveUsage, setLeaveUsage] = useState({
    annualLeaves: 0,
    medical: 0,
    casual: 0,
    abOnPublicHoliday: 0,
    other: 0,
    noPayLeaves: 0,
    monthlyMandatoryLeaves: 0,
  });

  const [yearlyLeaveUsage, setYearlyLeaveUsage] = useState({
    annualLeaves: 0,
    casual: 0,
    medical: 0,
  });
  
// Fetch leave details when an employee is selected
  useEffect(() => {
    const loadLeaveDetails = async () => {
      if (props.employeeId && props.selectedYear) {
        try {
          const details = await fetchLeaveDetails(
            props.employeeId,
            props.selectedYear
          );
          setLeaveDetails(details || { annualLeaves: 0, casual: 0, medical: 0 });
        } catch (error) {
          console.error('Error fetching leave details:', error);
          alert(
            `Failed to fetch leave details for this employee in ${props.selectedYear}. Please try again.`
          );
        }
      }
    };

    loadLeaveDetails();
  }, [props.employeeId, props.selectedYear]);


    // Fetch yearly leave usage when an employee is selected
    useEffect(() => {
      const loadYearlyLeaveUsage = async () => {
        if (props.employeeId && props.selectedYear) {
          try {
            const details = await fetchYearlyLeaveUsage(
              props.employeeId,
              props.selectedYear
            );
            setYearlyLeaveUsage(details || { annualLeaves: 0, casual: 0, medical: 0 });
          } catch (error) {
            console.error('Error fetching yearly leave usage:', error);
            alert(
              `Failed to fetch yearly leave usage for this employee in ${props.selectedYear}. Please try again.`
            );
          }
        }
      };
  
      loadYearlyLeaveUsage();
    }, [props.employeeId, props.selectedYear]);
 
  useEffect(() => {
    const currentMonth = dayjs(`01 ${props.selectedMonth} 2000`, "DD MMMM YYYY").month(); 
    const currentYear = props.selectedYear;
    const days = [];
    const daysInCurrentMonth = dayjs(new Date(currentYear, currentMonth, 1)).daysInMonth();

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
                  shift: attendanceRecord.shift?attendanceRecord.shift.shiftPeriod || 'MORNING':'',
      
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
        
        const employeeAttendanceSummary = await fetchAttendanceSummary(props.employeeId,props.selectedYear,props.selectedMonth);
        setAttendanceSummary({
          daysInCurrentMonth,
          ...employeeAttendanceSummary
        });

      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    loadEmployeeAttendance();
  }, [props.employeeId, props.selectedMonth, props.selectedYear]);


  useEffect(() => {
    const loadLeaveUsage = async () => {
      if (props.employeeId && props.selectedYear && props.selectedMonth) {
        try {
          const details = await fetchLeaveUsage(props.employeeId, props.selectedYear, props.selectedMonth);

          // If the API returns an empty response, handle it
          if (!details || Object.keys(details).length === 0) {
            setLeaveUsage({ annual: 0, casual: 0, medical: 0 });
            //alert(`No leave details found for this employee in ${props.selectedMonth} ${props.selectedYear}.`);
          } else {
            setLeaveUsage(details);
          }
        } catch (error) {
          // Handle any errors from the API call
          console.error('Error fetching leave details:', error);
          //alert(`Failed to fetch leave details for this employee in ${props.selectedMonth} ${props.selectedYear}. Please try again.`);
        }
      }
    };

    loadLeaveUsage();
  }, [props.employeeId, props.selectedYear, props.selectedMonth]);

  const handleFieldChange = (index, field, value) => {
    const updatedDays = [...daysInMonth];
    updatedDays[index][field] = value;

    // If the attendance status is changed, set the new status
    if (field === 'attendanceStatus') {
        updatedDays[index].attendanceStatus = value;
    }

    setDaysInMonth(updatedDays);
};

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

const handleInputChange = (field, value) => {
  setLeaveUsage((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleLeaveSave = async () => {
  if (!props.employeeId) {
    alert('Please select an employee before saving.');
    return;
  }

  setSaving(true);
  try {
    const saveData = {
      employeeId: props.employeeId,
      year: props.selectedYear,
      month: props.selectedMonth,
      ...leaveUsage, // Include all leave details from the state
    };
    await saveLeaveUsage(saveData);
    alert('Leave details saved successfully!');
  } catch (error) {
    console.error('Error saving leave details:', error);
    alert('Failed to save leave details. Please try again.');
  } finally {
    setSaving(false);
  }
};

  return (
    <Box>
      <Box>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Total number days in Month:</TableCell>
              <TableCell>{attendanceSummary.daysInCurrentMonth}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>No. of attendance:</TableCell>
              <TableCell>{attendanceSummary.attendanceCount}</TableCell>
            </TableRow>
            
          <TableRow>
            <TableCell>No. of Leaves:</TableCell>
            <TableCell>
              <div>
                {attendanceSummary.daysInCurrentMonth - attendanceSummary.attendanceCount}
              </div>
              <div className="textbox-container">
                {[
                  { label: 'Annual Leave:', field: 'annual' },
                  { label: 'Casual Leave:', field: 'casual' },
                  { label: 'Medical Leave:', field: 'medical' },
                  { label: 'Absent on Public holiday:', field: 'abOnPublicHoliday' },
                  { label: 'Other Leave:', field: 'other' },
                  { label: 'No Pay Leave:', field: 'noPayLeaves' },
                  { label: 'Monthly Mandatory Leave (Weekly):', field: 'monthlyMandatoryLeaves' },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label>{label}</label>
                    <input
                      type="text"
                      value={leaveUsage[field] || ''}
                      onChange={(e) => handleInputChange(field, parseInt(e.target.value, 10) || 0)}
                    />
                    {(field === 'annual' || field === 'casual' || field === 'medical') && (
                      <span style={{ marginLeft: '20px' }}>
                        Remaining: {(leaveDetails ? leaveDetails[field] : 0) - (yearlyLeaveUsage ? yearlyLeaveUsage[field] : 0)}
                        </span>
                    )}
                  </div>
                ))}
                <button type="button" className="save-button" onClick={handleLeaveSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </TableCell>
          </TableRow>

            <TableRow>
              <TableCell>Total OT-1 Hours:</TableCell>
              <TableCell>{attendanceSummary.ot1HoursSum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total OT-2 Saturday Hours:</TableCell>
              <TableCell>{attendanceSummary.ot2HoursSaturdaySum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total OT-2 Holiday Hours:</TableCell>
              <TableCell>{attendanceSummary.ot2HoursHolidaysSum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Late Hours:</TableCell>
              <TableCell>{attendanceSummary.lateHoursSum}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <br/>
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
                      {/*<MenuItem value="ab-nopay">ab-nopay</MenuItem> */}
                      <MenuItem value="0.5">0.5</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                  </Select>
                </TableCell>

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
    </Box>
  );
}

export default AttendanceTable;