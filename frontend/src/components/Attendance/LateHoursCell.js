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

const LateHoursCell = ({ day, index, handleFieldChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [lcLateClockInChecked, setLcLateClockInChecked] = useState(true);
  const [lcEarlyClockOutChecked, setLcEarlyClockOutChecked] = useState(true);

  const handleExpandClick = () => setExpanded(!expanded);

  const calculateTotalLateMins = (late = 0, early = 0, lateChecked, earlyChecked) => {
    let total = 0;
    if (lateChecked) total += late;
    if (earlyChecked) total += early;
    return total;
  };

  const handleLateClockinChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalLateMins(
      value,
      day.updatedLcEarlyClockoutMins || 0,
      lcLateClockInChecked,
      lcEarlyClockOutChecked
    );
    handleFieldChange(index, 'updatedLcLateClockinMins', value);
    handleFieldChange(index, 'lateMins', updatedTotal);
  };

  const handleLcEarlyClockoutChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalLateMins(
      day.updatedLcLateClockinMins || 0,
      value,
      lcLateClockInChecked,
      lcEarlyClockOutChecked
    );
    handleFieldChange(index, 'updatedLcEarlyClockoutMins', value);
    handleFieldChange(index, 'lateMins', updatedTotal);
  };


  const handleCheckboxChange = (type) => {
    const isLate = type === 'late';
    const updatedCheckedState = isLate ? !lcLateClockInChecked : !lcEarlyClockOutChecked;
  
    if (isLate) {
      setLcLateClockInChecked(updatedCheckedState);
      if (!updatedCheckedState) {
        handleFieldChange(index, 'updatedLcLateClockinMins', 0); // Set value to 0
      }
    } else {
      setLcEarlyClockOutChecked(updatedCheckedState);
      if (!updatedCheckedState) {
        handleFieldChange(index, 'updatedLcEarlyClockoutMins', 0); // Set value to 0
      }
    }
  
    const updatedTotal = calculateTotalLateMins(
      isLate ? (updatedCheckedState ? day.updatedLcLateClockinMins || 0 : 0) : day.updatedLcLateClockinMins || 0,
      !isLate ? (updatedCheckedState ? day.updatedLcEarlyClockoutMins || 0 : 0) : day.updatedLcEarlyClockoutMins || 0,
      isLate ? updatedCheckedState : lcLateClockInChecked,
      !isLate ? updatedCheckedState : lcEarlyClockOutChecked
    );
  
    handleFieldChange(index, 'lateMins', updatedTotal);
  };
  

  return (
    <TableCell>
      <Accordion expanded={expanded} onChange={handleExpandClick}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{formatHourMins(day.lateMins || 0)}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={lcLateClockInChecked}
              onChange={() => handleCheckboxChange('late')}
            />
            <TextField
              label="Late Clock In Minutes"
              type="number"
              value={day.updatedLcLateClockinMins || 0}
              onChange={handleLateClockinChange}
              disabled={!lcLateClockInChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedLcLateClockinMins || 0)}`}
            />
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={lcEarlyClockOutChecked}
              onChange={() => handleCheckboxChange('early')}
            />
            <TextField
              label="Early Clock Out Minutes"
              type="number"
              value={day.updatedLcEarlyClockoutMins || 0}
              onChange={handleLcEarlyClockoutChange}
              disabled={!lcEarlyClockOutChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedLcEarlyClockoutMins || 0)}`}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default LateHoursCell;