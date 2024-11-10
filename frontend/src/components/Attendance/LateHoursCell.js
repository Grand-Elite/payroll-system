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

const LateHoursCell = ({ day, index, handleFieldChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [lateClockInsChecked, setLateClockInsChecked] = useState(true);
  const [earlyClockOutsChecked, setEarlyClockOutsChecked] = useState(true);

  const handleExpandClick = () => setExpanded(!expanded);

  const calculateTotalLateHours = (lateHours, earlyOutHours, lateChecked, earlyOutChecked) => {
    let total = 0;
    if (lateChecked) total += lateHours || 0;
    if (earlyOutChecked) total += earlyOutHours || 0;
    return total;
  };

  const handleLateClockInsChange = (event) => {
    const value = Number(event.target.value);
    const updatedTotal = calculateTotalLateHours(value, day.earlyClockOutHours || 0, lateClockInsChecked, earlyClockOutsChecked);
    handleFieldChange(index, 'lateClockInHours', value); // Update late clock-in hours specifically
    handleFieldChange(index, 'lateHours', updatedTotal); // Update total late hours
  };

  const handleEarlyClockOutChange = (event) => {
    const value = Number(event.target.value);
    const updatedTotal = calculateTotalLateHours(day.lateClockInHours || 0, value, lateClockInsChecked, earlyClockOutsChecked);
    handleFieldChange(index, 'earlyClockOutHours', value); // Update early clock-out hours specifically
    handleFieldChange(index, 'lateHours', updatedTotal); // Update total late hours
  };

  const handleCheckboxChange = (type) => {
    if (type === 'late') {
      const newChecked = !lateClockInsChecked;
      setLateClockInsChecked(newChecked);
      const updatedTotal = calculateTotalLateHours(day.lateClockInHours || 0, day.earlyClockOutHours || 0, newChecked, earlyClockOutsChecked);
      handleFieldChange(index, 'lateHours', updatedTotal);
    }
    if (type === 'early') {
      const newChecked = !earlyClockOutsChecked;
      setEarlyClockOutsChecked(newChecked);
      const updatedTotal = calculateTotalLateHours(day.lateClockInHours || 0, day.earlyClockOutHours || 0, lateClockInsChecked, newChecked);
      handleFieldChange(index, 'lateHours', updatedTotal);
    }
  };

  return (
    <TableCell>
      <Accordion expanded={expanded} onChange={handleExpandClick}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{day.lateHours || 0}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={lateClockInsChecked}
              onChange={() => handleCheckboxChange('late')}
            />
            <TextField
              label="Late Clock-In Hours"
              type="number"
              value={day.lateClockInHours || 0}
              onChange={handleLateClockInsChange}
              disabled={!lateClockInsChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
            />
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={earlyClockOutsChecked}
              onChange={() => handleCheckboxChange('early')}
            />
            <TextField
              label="Early Clock-Out Hours"
              type="number"
              value={day.earlyClockOutHours || 0}
              onChange={handleEarlyClockOutChange}
              disabled={!earlyClockOutsChecked}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default LateHoursCell;
