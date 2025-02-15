import React, { useState } from 'react';
import {
  TableCell,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatHourMins } from '../../util/DateTimeUtil';

const LateHoursCell = ({ day, index, handleFieldChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [includeLateClockin, setIncludeLateClockin] = useState(true);
  const [includeEarlyClockout, setIncludeEarlyClockout] = useState(true);

  const handleExpandClick = () => setExpanded(!expanded);

  const calculateTotalLateMins = (late = 0, early = 0) => {
    return (includeLateClockin ? late : 0) + (includeEarlyClockout ? early : 0);
  };

  const handleLateClockinChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalLateMins(
      value,
      day.updatedLcEarlyClockoutMins || 0
    );
    handleFieldChange(index, 'updatedLcLateClockinMins', value);
    handleFieldChange(index, 'lateMins', updatedTotal);
  };

  const handleLcEarlyClockoutChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalLateMins(
      day.updatedLcLateClockinMins || 0,
      value
    );
    handleFieldChange(index, 'updatedLcEarlyClockoutMins', value);
    handleFieldChange(index, 'lateMins', updatedTotal);
  };

  const handleCheckboxChange = (type) => {
    let newIncludeLateClockin = includeLateClockin;
    let newIncludeEarlyClockout = includeEarlyClockout;

    if (type === 'lateClockin') {
      newIncludeLateClockin = !includeLateClockin;
      setIncludeLateClockin(newIncludeLateClockin);
      if (!newIncludeLateClockin) {
        // Clear the value if unchecked.
        handleFieldChange(index, 'updatedLcLateClockinMins', 0);
      }
    } else if (type === 'earlyClockout') {
      newIncludeEarlyClockout = !includeEarlyClockout;
      setIncludeEarlyClockout(newIncludeEarlyClockout);
      if (!newIncludeEarlyClockout) {
        // Clear the value if unchecked.
        handleFieldChange(index, 'updatedLcEarlyClockoutMins', 0);
      }
    }

    // Recalculate total using the updated states.
    const lateValue = newIncludeLateClockin ? day.updatedLcLateClockinMins || 0 : 0;
    const earlyValue = newIncludeEarlyClockout ? day.updatedLcEarlyClockoutMins || 0 : 0;
    const updatedTotal = lateValue + earlyValue;

    handleFieldChange(index, 'lateMins', updatedTotal);
  };

  return (
    <TableCell>
      <Accordion expanded={expanded} onChange={handleExpandClick}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {formatHourMins(day.lateMins || 0)}
            {day.overwritten}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={includeLateClockin}
              onChange={() => handleCheckboxChange('lateClockin')}
            />
            <TextField
              label="Late Clock In Minutes"
              value={day.updatedLcLateClockinMins || 0}
              onChange={handleLateClockinChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedLcLateClockinMins || 0)}`}
              disabled={!includeLateClockin}
            />
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={includeEarlyClockout}
              onChange={() => handleCheckboxChange('earlyClockout')}
            />
            <TextField
              label="Early Clock Out Minutes"
              value={day.updatedLcEarlyClockoutMins || 0}
              onChange={handleLcEarlyClockoutChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedLcEarlyClockoutMins || 0)}`}
              disabled={!includeEarlyClockout}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default LateHoursCell;
