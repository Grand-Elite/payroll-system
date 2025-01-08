import React, { useState } from 'react';
import {
  TableCell,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatHourMins } from '../../util/DateTimeUtil';

const OTHoursCell = ({ day, index, handleFieldChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  const calculateTotalOTMins = (early = 0, late = 0) => {
    return early + late;
  };

  const handleEarlyClockInChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalOTMins(
      value,
      day.updatedOtLateClockoutMins || 0
    );
    handleFieldChange(index, 'updatedOtEarlyClockinMins', value);
    handleFieldChange(index, 'otMins', updatedTotal);
  };

  const handleLateClockOutChange = (event) => {
    const value = Number(event.target.value) || 0;
    const updatedTotal = calculateTotalOTMins(
      day.updatedOtEarlyClockinMins || 0,
      value
    );
    handleFieldChange(index, 'updatedOtLateClockoutMins', value);
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
            <TextField
              label="Early Clock In OT Minutes"
              value={day.updatedOtEarlyClockinMins || 0}
              onChange={handleEarlyClockInChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedOtEarlyClockinMins || 0)}`}
              disabled
            />
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Late Clock Out OT Minutes"
              value={day.updatedOtLateClockoutMins || 0}
              onChange={handleLateClockOutChange}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
              helperText={`hh:mm - ${formatHourMins(day.updatedOtLateClockoutMins || 0)}`}
              disabled
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </TableCell>
  );
};

export default OTHoursCell;
