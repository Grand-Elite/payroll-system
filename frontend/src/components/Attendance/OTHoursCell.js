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

const OTHoursCell = ({ day, index, handleFieldChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [earlyClockInsChecked, setEarlyClockInsChecked] = useState(true);
    const [afterHoursChecked, setAfterHoursChecked] = useState(true);
  
    const handleExpandClick = () => setExpanded(!expanded);
  
    const calculateTotalOTHours = (early, after, earlyChecked, afterChecked) => {
      let total = 0;
      if (earlyChecked) total += early || 0;
      if (afterChecked) total += after || 0;
      return total;
    };
  
    const handleEarlyClockInsChange = (event) => {
      const value = Number(event.target.value);
      const updatedTotal = calculateTotalOTHours(value, day.afterHours || 0, earlyClockInsChecked, afterHoursChecked);
      handleFieldChange(index, 'earlyClockIns', value);
      handleFieldChange(index, 'otHours', updatedTotal);
    };
  
    const handleAfterHoursChange = (event) => {
      const value = Number(event.target.value);
      const updatedTotal = calculateTotalOTHours(day.earlyClockIns || 0, value, earlyClockInsChecked, afterHoursChecked);
      handleFieldChange(index, 'afterHours', value);
      handleFieldChange(index, 'otHours', updatedTotal);
    };
  
    const handleCheckboxChange = (type) => {
      if (type === 'early') {
        const newChecked = !earlyClockInsChecked;
        setEarlyClockInsChecked(newChecked);
        const updatedTotal = calculateTotalOTHours(day.earlyClockIns || 0, day.afterHours || 0, newChecked, afterHoursChecked);
        handleFieldChange(index, 'otHours', updatedTotal);
      }
      if (type === 'after') {
        const newChecked = !afterHoursChecked;
        setAfterHoursChecked(newChecked);
        const updatedTotal = calculateTotalOTHours(day.earlyClockIns || 0, day.afterHours || 0, earlyClockInsChecked, newChecked);
        handleFieldChange(index, 'otHours', updatedTotal);
      }
    };
  
    return (
      <TableCell>
        <Accordion expanded={expanded} onChange={handleExpandClick}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{day.otHours || 0}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" alignItems="center" mb={2}>
              <Checkbox
                checked={earlyClockInsChecked}
                onChange={() => handleCheckboxChange('early')}
              />
              <TextField
                label="Early Clock Ins"
                type="number"
                value={day.earlyClockIns || 0}
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
                type="number"
                value={day.afterHours || 0}
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
  
