import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import MonthSalaryPermanent from "./MonthSalaryPermanent";
import MonthSalaryTemporary from "./MonthSalaryTemporary";

function SalaryPaymentSummary({selectedYear, selectedMonth }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ marginBottom: 2 }} 
      >
        <Tab label="Permanent Employees" />
        <Tab label="Temporary Employees" />
      </Tabs>
      <Box sx={{ mt: 2 }}> 
        {activeTab === 0 && <MonthSalaryPermanent selectedYear={selectedYear} selectedMonth={selectedMonth} />}
        {activeTab === 1 && <MonthSalaryTemporary selectedYear={selectedYear} selectedMonth={selectedMonth}/>}
      </Box>
    </Box>
  );
}

export default SalaryPaymentSummary;
