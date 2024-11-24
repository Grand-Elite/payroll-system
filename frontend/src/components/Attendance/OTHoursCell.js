import React, { useState } from 'react';
import {
  TableCell,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatHourMins } from '../../util/DateTimeUtil';

const OTHoursCell = ({ day, index, handleFieldChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [otEarlyClockInChecked, setOtEarlyClockInChecked] = useState(true);
  const [otLateClockOutChecked, setOtLateClockOutChecked] = useState(true);

  const handleExpandClick = () => setExpanded(!expanded);

  const calculateTotalOTMins = (early = 0, late = 0, earlyChecked, lateChecked) => {
    let total = 0;
    if (earlyChecked) total += early;
    if (lateChecked) total += late;
    return total;
  };

  const handleEarlyClockInChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalOTMins(
      value,
      day.updatedOtLateClockoutMins || 0,
      otEarlyClockInChecked,
      otLateClockOutChecked
    );
    handleFieldChange(index, 'updatedOtEarlyClockinMins', value);
    handleFieldChange(index, 'otMins', updatedTotal);
  };

  const handleLateClockOutChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalOTMins(
      day.updatedOtEarlyClockinMins || 0,
      value,
      otEarlyClockInChecked,
      otLateClockOutChecked
    );
    handleFieldChange(index, 'updatedOtLateClockoutMins', value);
    handleFieldChange(index, 'otMins', updatedTotal);
  };

  /*
  const handleCheckboxChange = (type) => {
    const isEarly = type === 'early';
    const updatedCheckedState = isEarly ? !otEarlyClockInChecked : !otLateClockOutChecked;

    if (isEarly) setOtEarlyClockInChecked(updatedCheckedState);
    else setOtLateClockOutChecked(updatedCheckedState);

    const updatedTotal = calculateTotalOTMins(
      day.updatedOtEarlyClockinMins || 0,
      day.updatedOtLateClockoutMins || 0,
      isEarly ? updatedCheckedState : otEarlyClockInChecked,
      !isEarly ? updatedCheckedState : otLateClockOutChecked
    );

    handleFieldChange(index, 'otMins', updatedTotal);
  };
  */

  const handleCheckboxChange = (type) => {
    const isEarly = type === 'early';
    const updatedCheckedState = isEarly ? !otEarlyClockInChecked : ! otLateClockOutChecked;
  
    if (isEarly) {
      setOtEarlyClockInChecked(updatedCheckedState);
      if (!updatedCheckedState) {
        handleFieldChange(index, 'updatedOtEarlyClockinMins', 0); // Set value to 0
      }
    } else {
      setOtLateClockOutChecked(updatedCheckedState);
      if (!updatedCheckedState) {
        handleFieldChange(index, 'updatedOtLateClockoutMins', 0); // Set value to 0
      }
    }
  
    const updatedTotal = calculateTotalOTMins(
      isEarly ? (updatedCheckedState ? day.updatedOtEarlyClockinMins || 0 : 0) : day.updatedOtEarlyClockinMins || 0,
      !isEarly ? (updatedCheckedState ? day.updatedOtLateClockoutMins || 0 : 0) : day.updatedOtLateClockoutMins || 0,
      isEarly ? updatedCheckedState : otEarlyClockInChecked,
      !isEarly ? updatedCheckedState : otLateClockOutChecked
    );
  
    handleFieldChange(index, 'otMins', updatedTotal);
  };



  return (
    <TableCell>
      <Accordion expanded={expanded} onChange={handleExpandClick}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{formatHourMins(day.otMins || 0)}{day.overwritten}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={otEarlyClockInChecked}
              onChange={() => handleCheckboxChange('early')}
            />
            <TextField
              label="Early Clock In OT Minutes"
              type="number"
              value={day.updatedOtEarlyClockinMins || 0}
              onChange={handleEarlyClockInChange}
              disabled={!otEarlyClockInChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedOtEarlyClockinMins || 0)}`}
            />
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={otLateClockOutChecked}
              onChange={() => handleCheckboxChange('late')}
            />
            <TextField
              label="Late Clock Out OT Minutes"
              type="number"
              value={day.updatedOtLateClockoutMins || 0}
              onChange={handleLateClockOutChange}
              disabled={!otLateClockOutChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedOtLateClockoutMins || 0)}`}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default OTHoursCell;
