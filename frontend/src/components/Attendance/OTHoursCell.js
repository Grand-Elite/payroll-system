
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
    const [earlyClockInsChecked, setEarlyClockInsChecked] = useState(true);
    const [afterHoursChecked, setAfterHoursChecked] = useState(true);
  
    const handleExpandClick = () => setExpanded(!expanded);
  
    const calculateTotalOTMins = (early, after, earlyChecked, afterChecked) => {
      let total = 0;
      if (earlyChecked) total += early || 0;
      if (afterChecked) total += after || 0;
      return total;
    };
  
    const handleEarlyClockInsChange = (event) => {
      const value = Number(event.target.value);
      const updatedTotal = calculateTotalOTMins(value, day.otLateClockoutMins || 0, earlyClockInsChecked, afterHoursChecked);
      handleFieldChange(index, 'otEarlyClockinMins', value);
      handleFieldChange(index, 'otMins', updatedTotal);
    };
  
    const handleAfterHoursChange = (event) => {
      const value = Number(event.target.value);
      const updatedTotal = calculateTotalOTMins(day.otEarlyClockinMins || 0, value, earlyClockInsChecked, afterHoursChecked);
      handleFieldChange(index, 'otLateClockoutMins', value);
      handleFieldChange(index, 'otMins', updatedTotal);
    };
  
    const handleCheckboxChange = (type) => {
      if (type === 'early') {
        const newChecked = !earlyClockInsChecked;
        setEarlyClockInsChecked(newChecked);
        const updatedTotal = calculateTotalOTMins(day.otEarlyClockinMins || 0, day.otLateClockoutMins || 0, newChecked, afterHoursChecked);
        handleFieldChange(index, 'otMins', updatedTotal);
      }
      if (type === 'after') {
        const newChecked = !afterHoursChecked;
        setAfterHoursChecked(newChecked);
        const updatedTotal = calculateTotalOTMins(day.otEarlyClockinMins || 0, day.otLateClockoutMins || 0, earlyClockInsChecked, newChecked);
        handleFieldChange(index, 'otMins', updatedTotal);
      }
    };
  
    return (
      <TableCell>
        <Accordion expanded={expanded} onChange={handleExpandClick}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{formatHourMins(day.otMins)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" alignItems="center" mb={2}>
              <Checkbox
                checked={earlyClockInsChecked}
                onChange={() => handleCheckboxChange('early')}
              />
              <TextField
                label="Early Clock In hours"
                type="string"
                value={formatHourMins(day.otEarlyClockinMins)}
                onChange={handleEarlyClockInsChange}
                disabled={!earlyClockInsChecked}
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
              />
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Checkbox
                checked={afterHoursChecked}
                onChange={() => handleCheckboxChange('after')}
              />
              <TextField
                label="After Hours"
                type="string"
                value={formatHourMins(day.otLateClockoutMins)}
                onChange={handleAfterHoursChange}
                disabled={!afterHoursChecked}
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
  
  export default OTHoursCell;