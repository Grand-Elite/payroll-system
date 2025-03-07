import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  saveAdjustedAttendanceSummary,
  getAdjustedAttendanceSummary,

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
  const [adjustedLateTime, setAdjustedLateTime] = useState('');
  const [adjustedOtHours, setAdjustedOtHours] = useState('');
  //const [shifts, setShifts] = useState([]); // State to hold multiple shifts
  const [leaveUsage, setLeaveUsage] = useState({
    annual: 0,
    medical: 0,
    casual: 0,
    abOnPublicHoliday: 0,
    other: 0,
    noPayLeaves: 0,
    monthlyMandatoryLeaves: 0,
    leaveApproval: false,
  });

  const [yearlyLeaveUsage, setYearlyLeaveUsage] = useState({
    annual: 0,
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
          setLeaveDetails(details || { annual: 0, casual: 0, medical: 0 });
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

useEffect(() => {
  const loadAdjustedAttendanceDetails = async () => {
    if (props.employeeId && props.selectedYear && props.selectedMonth) {
      try {
        const details = await getAdjustedAttendanceSummary(
          props.employeeId,
          props.selectedYear,
          props.selectedMonth
        );

        // Set the state with fetched values or defaults
        setAdjustedOtHours(details?.adjustedOtHours ?? 0);
        setAdjustedLateTime(details?.adjustedLateTime ?? 0);
      } catch (error) {
        console.error('Error fetching adjusted OT and Late Times details:', error);
        // Display 0 in textboxes in case of error
        setAdjustedOtHours(0);
        setAdjustedLateTime(0);
      }
    } else {
      // Ensure state is reset to 0 if required fields are missing
      setAdjustedOtHours(0);
      setAdjustedLateTime(0);
    }
  };

  loadAdjustedAttendanceDetails();
}, [props.employeeId, props.selectedYear, props.selectedMonth]);

    // Fetch yearly leave usage when an employee is selected
    useEffect(() => {
      const loadYearlyLeaveUsage = async () => {
        if (props.employeeId && props.selectedYear) {
          try {
            const details = await fetchYearlyLeaveUsage(
              props.employeeId,
              props.selectedYear
            );
            setYearlyLeaveUsage(details || { annual: 0, casual: 0, medical: 0 });
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


    //props.shifts
 
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

/*   To save the attendance record changes individually row wise*/

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
      toast.success('Attendance record updated successfully',{autoClose: 5000});
    } catch (error) {
      console.error('Error updating attendance record:', error);
      alert('Failed to update attendance record');
    }
  }
};


const handleSaveAll = async () => {
  if (Array.isArray(daysInMonth)) {
    // Iterate through each day in the month
    for (let index = 0; index < daysInMonth.length; index++) {
      const day = daysInMonth[index];

      // Check if there are any changes compared to the original values
      if (
        day.attendanceStatus !== day.originalAttendanceStatus ||
        day.updatedOtEarlyClockinMins !== day.otEarlyClockinMins ||
        day.updatedOtLateClockoutMins !== day.otLateClockoutMins ||
        day.updatedLcLateClockinMins !== day.lcLateClockinMins ||
        day.updatedLcEarlyClockoutMins !== day.lcEarlyClockoutMins ||
        day.lateMins !== day.originalLateMins ||
        day.otMins !== day.originalOtMins
      ) {
        try {
          // Call the API to update the attendance status
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
          toast.success('Attendance record updated successfully', { autoClose: 5000 });
        } catch (error) {
          console.error('Error updating attendance record:', error);
          alert('Failed to update attendance record');
        }
      }
    }
  } else {
    console.error('daysInMonth is not an array');
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

  const totalEnteredLeaves = Object.values(leaveUsage).reduce((total, value) => {
    return total + (typeof value === 'number' ? value : 0);
  }, 0);

  const maxLeaves =
    attendanceSummary && attendanceSummary.daysInCurrentMonth && attendanceSummary.attendanceCount !== undefined
      ? attendanceSummary.daysInCurrentMonth - attendanceSummary.attendanceCount
      : 0;

  if (totalEnteredLeaves > maxLeaves) {
    alert('The total Leave amount you entered is exceeded the acutual leave amount that has been taken by this employee for this month!!!! Please Check Your inputs again!!!');
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
    toast.success('Leave details saved successfully!', { autoClose: 5000 });
  } catch (error) {
    console.error('Error saving leave details:', error);
    alert('Failed to save leave details. Please try again.');
  } finally {
    setSaving(false);
  }
};

const handleAdjustedAttendanceSubmit = async () => {
  setSaving(true);
  try {
      await saveAdjustedAttendanceSummary(
          props.employeeId,
          props.selectedYear,
          props.selectedMonth,
          adjustedLateTime,
          adjustedOtHours
      );
      toast.success('Adjusted OT and Late Times Saved successfully', { autoClose: 5000 }); // Toast success message
  } catch (error) {
      console.error('Error saving adjustments:', error);
      alert('Failed to save adjustments'); // You can replace this with a toast error message too if needed
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
      {attendanceSummary?.daysInCurrentMonth !== undefined &&
      attendanceSummary?.attendanceCount !== undefined
        ? attendanceSummary.daysInCurrentMonth - attendanceSummary.attendanceCount
        : 'Loading...'}
    </div>

    <div className="textbox-container">
      {[
        { label: 'Annual Leave:', field: 'annual' },
        { label: 'Casual Leave:', field: 'casual' },
        { label: 'Medical Leave:', field: 'medical' },
        { label: 'Public Leave:', field: 'abOnPublicHoliday' },
        { label: 'Other Leave:', field: 'other' },
        { label: 'No Pay Leave:', field: 'noPayLeaves' },
        { label: 'Monthly Mandatory Leave (Weekly):', field: 'monthlyMandatoryLeaves' },
      ].map(({ label, field }) => {
        if (!leaveDetails || !yearlyLeaveUsage) {
          return (
            <div key={field}>
              <label>{label}</label>
              <span style={{ color: 'gray', marginLeft: '10px' }}>Loading...</span>
            </div>
          );
        }

        const leaveDetailValue = leaveDetails[field] || 0;
        const yearlyUsageValue = yearlyLeaveUsage[field] || 0;
        const remaining = leaveDetailValue - yearlyUsageValue;
        const disableInput = ['annual', 'casual', 'medical'].includes(field) && remaining <= 0;

        return (
          <div key={field}>
            <label>{label}</label>
            <input
              type="number"
              min="0"
              value={leaveUsage[field] || ''}
              onChange={(e) => {
                const inputValue = Math.max(0, parseInt(e.target.value, 10) || 0);

                const totalUsage = Object.keys(leaveUsage).reduce((total, key) => {
                  return total + (leaveUsage[key] || 0);
                }, 0);

                const maxLeaves =
                  attendanceSummary?.daysInCurrentMonth !== undefined &&
                  attendanceSummary?.attendanceCount !== undefined
                    ? attendanceSummary.daysInCurrentMonth - attendanceSummary.attendanceCount
                    : 0;

                if (['annual', 'casual', 'medical'].includes(field) && inputValue > remaining) {
                  alert(`Error: Value exceeds remaining leaves (${remaining}). Please enter a valid number.`);
                  return;
                }

                if (totalUsage > maxLeaves) {
                  alert(`Error: Total leave usage exceeds available "No. of Leaves" (${maxLeaves}).`);
                  return;
                }

                handleInputChange(field, inputValue);
              }}
              disabled={disableInput}
            />
            {['annual', 'casual', 'medical'].includes(field) && (
              <>
                <span style={{ marginLeft: '20px' }}>Remaining: {remaining}</span>
                {leaveDetailValue === 0 && (
                  <span style={{ color: 'blue', marginLeft: '10px' }}>
                    Yearly Leave Quota is not Available!
                  </span>
                )}
                {disableInput && (
                  <span style={{ color: 'red', marginLeft: '10px' }}>
                    No more leaves can be allocated
                  </span>
                )}
              </>
            )}
          </div>
        );
      })}

{/* Leaves Approval Section */}
<div style={{ marginTop: '15px' }}>
  <label>Leaves Approved:</label>
  <div style={{ marginLeft: '20px', display: 'inline-block' }}>
    <input
      type="radio"
      id="approvedYes"
      name="leaveApproval"
      value="yes"
      checked={leaveUsage.leaveApproval === true} // Only check when explicitly true
      onChange={() => handleInputChange('leaveApproval', true)}
    />
    <label htmlFor="approvedYes" style={{ marginRight: '15px' }}>Yes</label>

    <input
      type="radio"
      id="approvedNo"
      name="leaveApproval"
      value="no"
      checked={leaveUsage.leaveApproval === false} // Only check when explicitly false
      onChange={() => handleInputChange('leaveApproval', false)}
    />
    <label htmlFor="approvedNo">No</label>
  </div>
</div>


      {/* Total Entered Leaves */}
      <div>
        <label>Total Entered Leaves:</label>
        <span>
          {Object.values(leaveUsage).reduce((total, value) => total + (typeof value === 'number' ? value : 0), 0)}
        </span>
      </div>

      {/* Save Button */}
      <button type="button" className="save-button" onClick={handleLeaveSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  </TableCell>
</TableRow>



        <TableRow>
        <TableCell>Cumulative OT and Late Time</TableCell>
    <TableCell>
        <div>
            Total OT-1 Hours: {attendanceSummary.ot1HoursSum}
            <span className="adjustment-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Adjustments if needed:
              <input
                type="text"
                value={adjustedOtHours} // Tied to state variable
                onChange={(e) => setAdjustedOtHours(e.target.value)} // Update state on change
              />
              <span style={{ marginLeft: '8px' }}>Compulsory OT Hours: {attendanceSummary.ot1CompulsoryHoursSum}</span>
            </span>
          </div>
        <div>
         Total Late Hours: {attendanceSummary.lateHoursSum}
          <span className="adjustment-container">
            Adjustments if needed:
            <input
              type="text"
              value={adjustedLateTime} // Tied to state variable
              onChange={(e) => setAdjustedLateTime(e.target.value)} // Update state on change
            />
          </span>
        </div>
        <div>
          Total Late Days : {attendanceSummary.lateDaysSum}
        </div>
        <button
          type="button"
          className="save-button"
          onClick={handleAdjustedAttendanceSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <ToastContainer />
    </TableCell>

            </TableRow>
            <TableRow>
              <TableCell>Poya Day Attendance</TableCell>
              <TableCell>{attendanceSummary.poyaNotSaturdayWorkedCount + attendanceSummary.poyaOnSaturdayWorkedCount}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total No. of Saturday Attendance</TableCell>
              <TableCell>{attendanceSummary.saturdayWorkedCount}</TableCell>
            </TableRow>
            {props.shifts[0] && 
            <TableRow>
              <TableCell>Shift Start Time</TableCell>
              <TableCell>{props.shifts[0].startTime}, {props.shifts[0].shiftPeriod} </TableCell>
            </TableRow>
            }
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
          </TableRow>
        </TableHead>
        <TableBody>
          {daysInMonth.map((day, index) => (
            <TableRow
              key={index}
              style={{
                backgroundColor:
                  day.attendanceStatus !== 'ab' &&  day.attendanceStatus !== '1'  &&  day.attendanceStatus !== '0.5'? '#ffbaba' : 
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
                      <MenuItem value="0.5">0.5</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                  </Select>
                </TableCell>

{/* 
Save Button in each individual row separately- Only show the save button if the status has changed */}
              <TableCell> 
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
<br></br>
    <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSaveAll}
        >
            Save All
        </Button>

    </Box>
  );
}

export default AttendanceTable;