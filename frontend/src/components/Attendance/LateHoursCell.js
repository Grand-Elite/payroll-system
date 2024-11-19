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
      day.lcEarlyClockoutMins || 0,
      lcLateClockInChecked,
      lcEarlyClockOutChecked
    );
    handleFieldChange(index, 'lcLateClockinMins', value);
    handleFieldChange(index, 'lateMins', updatedTotal);
  };

  const handleLcEarlyClockoutChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalLateMins(
      day.lcLateClockinMins || 0,
      value,
      lcLateClockInChecked,
      lcEarlyClockOutChecked
    );
    handleFieldChange(index, 'lcEarlyClockoutMins', value);
    handleFieldChange(index, 'lateMins', updatedTotal);
  };

  const handleCheckboxChange = (type) => {
    let newCheckedLateClockIn = lcLateClockInChecked;
    let newCheckedEarlyClockOut = lcEarlyClockOutChecked;
  
    if (type === 'late') {
      newCheckedLateClockIn = !lcLateClockInChecked;
      setLcLateClockInChecked(newCheckedLateClockIn);
    } else if (type === 'early') {
      newCheckedEarlyClockOut = !lcEarlyClockOutChecked;
      setLcEarlyClockOutChecked(newCheckedEarlyClockOut);
    }
  
    // Recalculate total late minutes based on updated checkbox states
    const updatedTotal = calculateTotalLateMins(
      day.lcLateClockinMins || 0,
      day.lcEarlyClockoutMins || 0,
      newCheckedLateClockIn,
      newCheckedEarlyClockOut
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
              value={day.lcLateClockinMins || 0}
              onChange={handleLateClockinChange}
              disabled={!lcLateClockInChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.lcLateClockinMins || 0)}`}
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
              value={day.lcEarlyClockoutMins || 0}
              onChange={handleLcEarlyClockoutChange}
              disabled={!lcEarlyClockOutChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.lcEarlyClockoutMins || 0)}`}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default LateHoursCell;