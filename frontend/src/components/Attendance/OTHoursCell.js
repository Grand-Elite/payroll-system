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

const OTHoursCell = ({ day, index, handleFieldChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [includeEarly, setIncludeEarly] = useState(false); // Early checkbox is unchecked by default
  const [includeLate, setIncludeLate] = useState(true);

  const handleExpandClick = () => setExpanded(!expanded);

  // Calculate total overtime minutes based on checkbox inclusion.
  const calculateTotalOTMins = (early = 0, late = 0) => {
    return (includeEarly ? early : 0) + (includeLate ? late : 0);
  };

  const handleEarlyClockInChange = (event) => {
    const value = Number(event.target.value) || 0;
    handleFieldChange(index, 'updatedOtEarlyClockinMins', value);
    handleFieldChange(
      index,
      'otMins',
      calculateTotalOTMins(value, day.updatedOtLateClockoutMins || 0)
    );
  };

  const handleLateClockOutChange = (event) => {
    const value = Number(event.target.value) || 0;
    handleFieldChange(index, 'updatedOtLateClockoutMins', value);
    handleFieldChange(
      index,
      'otMins',
      calculateTotalOTMins(day.updatedOtEarlyClockinMins || 0, value)
    );
  };

  const handleCheckboxChange = (type) => {
    if (type === 'early') {
      const newIncludeEarly = !includeEarly;
      setIncludeEarly(newIncludeEarly);

      // When unchecked, clear the early clock-in value
      if (!newIncludeEarly) {
        handleFieldChange(index, 'updatedOtEarlyClockinMins', 0);
      }

      // Recalculate total OT minutes
      const earlyValue = newIncludeEarly ? day.updatedOtEarlyClockinMins || 0 : 0;
      const lateValue = includeLate ? day.updatedOtLateClockoutMins || 0 : 0;
      const newOtMins = earlyValue + lateValue;

      handleFieldChange(index, 'otMins', newOtMins);
    } else if (type === 'late') {
      const newIncludeLate = !includeLate;
      setIncludeLate(newIncludeLate);

      // When unchecked, clear the late clock-out value
      if (!newIncludeLate) {
        handleFieldChange(index, 'updatedOtLateClockoutMins', 0);
      }

      // Recalculate total OT minutes
      const earlyValue = includeEarly ? day.updatedOtEarlyClockinMins || 0 : 0;
      const lateValue = newIncludeLate ? day.updatedOtLateClockoutMins || 0 : 0;
      const newOtMins = earlyValue + lateValue;

      handleFieldChange(index, 'otMins', newOtMins);
    }
  };

  return (
    <TableCell>
      <Accordion expanded={expanded} onChange={handleExpandClick}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {formatHourMins(
              calculateTotalOTMins(
                day.updatedOtEarlyClockinMins || 0,
                day.updatedOtLateClockoutMins || 0
              )
            )}
            {day.overwritten}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={includeEarly}
              onChange={() => handleCheckboxChange('early')}
            />
            <TextField
              label="Early Clock In OT Minutes"
              value={day.updatedOtEarlyClockinMins || 0}
              onChange={handleEarlyClockInChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedOtEarlyClockinMins || 0)}`}
              disabled={!includeEarly} // Disable only if unchecked
            />
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={includeLate}
              onChange={() => handleCheckboxChange('late')}
            />
            <TextField
              label="Late Clock Out OT Minutes"
              value={day.updatedOtLateClockoutMins || 0}
              onChange={handleLateClockOutChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedOtLateClockoutMins || 0)}`}
              disabled={!includeLate}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default OTHoursCell;