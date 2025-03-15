import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { fetchEmployees, 
  getMonthlySalaryDetailsForAll, 
  fetchAttendanceSummary, 
  fetchLeaveUsage, 
  getAdjustedAttendanceSummary, 
} from "../../services/api";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function MonthSalaryPermanent({ selectedYear, selectedMonth }) {
  const [employees, setEmployees] = useState([]);
  const [salaryData, setSalaryData] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [leaveUsage, setLeaveUsage] = useState({});
  const [adjustedOtHours, setAdjustedOTHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalNetSalary, setTotalNetSalary] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch employee list
        const employeeList = await fetchEmployees();
        const filteredEmployees = employeeList.filter(
          (employee) => employee.epfNo !== null && employee.status === "ACTIVE"
        ); // Filter employees with non-null epfNo
        setEmployees(filteredEmployees);
  
        // Fetch salary details
        const salaryDetails = await getMonthlySalaryDetailsForAll(
          selectedYear,
          selectedMonth
        );
        const salaryDataTemp = {};
        salaryDetails.forEach((detail) => {
          if (detail.employee && detail.employee.employeeId) {
            salaryDataTemp[detail.employee.employeeId] = detail;
          }
        });
        setSalaryData(salaryDataTemp);
  
        // Fetch attendance summary for each employee
        const attendanceDataTemp = {};
        for (let employee of filteredEmployees) {
          const attendanceSummary = await fetchAttendanceSummary(
            employee.employeeId,
            selectedYear,
            selectedMonth
          );
          attendanceDataTemp[employee.employeeId] = attendanceSummary;
        }
        setAttendanceData(attendanceDataTemp);
  
        const leaveUsageDataTemp = {};
        for (let employee of filteredEmployees){
          const leaveUsage = await fetchLeaveUsage(
            employee.employeeId,
            selectedYear,
            selectedMonth
          );
          leaveUsageDataTemp[employee.employeeId] = leaveUsage;
        }
        setLeaveUsage(leaveUsageDataTemp);
  
        // Fetch OT hours for each employee
        const otHoursDataTemp = {};
        for (let employee of filteredEmployees) {
          try {
            const adjustedOTHours = await getAdjustedAttendanceSummary(
              employee.employeeId,
              selectedYear,
              selectedMonth
            );
            console.log(`OT Hours for ${employee.fullName}:`, adjustedOTHours.adjustedOtHours);
            otHoursDataTemp[employee.employeeId] = adjustedOTHours.adjustedOtHours;
          } catch (error) {
            console.error(`Error fetching OT hours for ${employee.fullName}:`, error);
          }
        }
        console.log("OT Hours Data Temp:", otHoursDataTemp);
        setAdjustedOTHours(otHoursDataTemp);
  
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    // Calculate total net salary whenever salaryData changes
    let total = 0;
    employees.forEach((employee) => {
      const netSalary = salaryData[employee.employeeId]?.netSalary ?? 0;
      total += parseFloat(netSalary);
    });
    setTotalNetSalary(total);
  }, [employees, salaryData]);

  const formatAmount = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "0.00";
    return parseFloat(value).toFixed(2);
  };

  // Define the salary attributes keys
  const salaryAttributes = {
    basic: "Basic+BR1+BR2",
    noPayAmount: "No Pay Amount",
    totalForEpf: "Total For EPF",
    ot1: "OT-1 Amount",
    ot2: "OT-2 Amount",
    attendanceTransportAllowance: "Attendance/Transport Allowance",
    performanceAllowance: "Performance Allowance",
    monthEncouragementAllowance: "Encouragement Allowance",
    incentives: "Incentives",
    totalMonthlySalary: "Total Monthly Salary",
    epfEmployeeAmount: "EPF 8% employee Amount",
    salaryAdvance: "Salary Advance",
    lateCharges: "Late Charges",
    otherDeductions: "Other Deduction",
    foodBill: "Food Bill",
    totalDeduction: "Total Deduction",
    netSalary: "Net Salary",
  };

  const generatePDF = () => {
    const doc = new jsPDF("landscape");
  
    doc.setFontSize(12);
    doc.text("HOTEL GRAND ELITE", 14, 20);
    doc.text("Salary Payments", 14, 28);
    doc.text(`${selectedMonth}`, 14, 36);
    doc.text(`-${selectedYear}`, 45, 36);
  
    const tableData = employees.map((employee) => {
      const row = [employee.epfNo, employee.fullName];
      row.push(attendanceData[employee.employeeId]?.attendanceCount ?? "0");
      row.push(leaveUsage[employee.employeeId]?.noPayLeaves ?? "0");
  
      // Add OT Hours here
      const otHours = adjustedOtHours[employee.employeeId] ?? "0"; // If OT hours are not found, default to 0
      row.push(formatAmount(otHours));
  
      Object.keys(salaryAttributes).forEach((attributeKey) => {
        if (attributeKey === "attendanceTransportAllowance") {
          const attendanceAllowance = salaryData[employee.employeeId]?.attendanceAllowance ?? 0;
          const transportAllowance = salaryData[employee.employeeId]?.transportAllowance ?? 0;
          row.push(formatAmount(attendanceAllowance + transportAllowance));
        } else {
          row.push(formatAmount(salaryData[employee.employeeId]?.[attributeKey] ?? 0));
        }
      });
      row.push(""); // Signature column
      return row;
    });
  
    const columns = [
      "EPF No",
      "Name",
      "Attendance",
      "No Pay Leaves",
      "OT Hours",  // Ensure OT Hours is part of the column headers
      ...Object.values(salaryAttributes),
      "Signature",
    ];
  
    doc.autoTable({
      head: [columns],
      body: tableData,
      startY: 50,
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 5,
        font: "times",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 6,
        font: "times",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        1: { cellWidth: 25 },
        [columns.length - 1]: { cellWidth: 25 },
        14: { fontStyle: "bold" },
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,
      margin: { top: 25, left: 10, right: 10, bottom: 10 },
      pageBreak: "auto",
    });
  
    doc.save(`monthly-salary-payment-permanent-staff-${selectedYear}-${selectedMonth}.pdf`);
  };
  
  const generateExcel = () => {
    // Define the columns array first
    const columns = [
      "EPF No",
      "Name",
      "Attendance",
      "No Pay Leaves",
      "OT Hours",  // Ensure OT Hours is part of the column headers
      ...Object.values(salaryAttributes),
      "Signature",
    ];

    const worksheetData = employees.map((employee) => {
      const row = [employee.epfNo, employee.fullName];
      row.push(attendanceData[employee.employeeId]?.attendanceCount ?? "0");
      row.push(leaveUsage[employee.employeeId]?.noPayLeaves ?? "0");

      // Add OT Hours here
      const otHours = adjustedOtHours[employee.employeeId] ?? "0"; // If OT hours are not found, default to 0
      row.push(formatAmount(otHours));

      Object.keys(salaryAttributes).forEach((attributeKey) => {
        if (attributeKey === "attendanceTransportAllowance") {
          const attendanceAllowance = salaryData[employee.employeeId]?.attendanceAllowance ?? 0;
          const transportAllowance = salaryData[employee.employeeId]?.transportAllowance ?? 0;
          row.push(formatAmount(attendanceAllowance + transportAllowance));
        } else {
          row.push(formatAmount(salaryData[employee.employeeId]?.[attributeKey] ?? 0));
        }
      });
      row.push(""); // Signature column
      return row;
    });

    // Add a row for the total net salary
    const totalRow = Array(columns.length).fill(""); // Create an empty row with the same number of columns
    totalRow[0] = "Total Salary Payment Amount:"; // Place the label in the first column
    totalRow[totalRow.length - 2] = `Rs. ${formatAmount(totalNetSalary)}`; // Place the value in the second last column (before the signature column)
    worksheetData.push(totalRow);

    const worksheet = XLSX.utils.aoa_to_sheet([columns, ...worksheetData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Payments");

    XLSX.writeFile(workbook, `monthly-salary-payment-permanent-staff-${selectedYear}-${selectedMonth}.xlsx`);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Salary Payments - Permanent Staff
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>EPF No</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Attendance</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>No Pay Leaves</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>OT Hours</TableCell>
                {Object.values(salaryAttributes).map((label) => (
                  <TableCell
                    key={label}
                    style={{
                      fontWeight:
                        label === "Total Monthly Salary" ? "bold" : "bold",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
                <TableCell style={{ fontWeight: "bold" }}>Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{employee.epfNo}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{attendanceData[employee.employeeId]?.attendanceCount ?? "0"}</TableCell>
                  <TableCell>{leaveUsage[employee.employeeId]?.noPayLeaves ?? "0"}</TableCell>
                  <TableCell>
                      {adjustedOtHours[employee.employeeId] !== undefined
                        ? formatAmount(adjustedOtHours[employee.employeeId])
                        : "0"}
                    </TableCell>
                  {Object.keys(salaryAttributes).map((attributeKey) => (
                    <TableCell
                      key={attributeKey}
                      style={{
                        fontWeight:
                          salaryAttributes[attributeKey] === "Total Monthly Salary"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {attributeKey === "attendanceTransportAllowance"
                        ? formatAmount(
                            (salaryData[employee.employeeId]?.attendanceAllowance ?? 0) +
                            (salaryData[employee.employeeId]?.transportAllowance ?? 0)
                          )
                        : formatAmount(salaryData[employee.employeeId]?.[attributeKey] ?? 0)}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Total Salary Payment Amount for Permanent Staff {selectedMonth}: Rs. {formatAmount(totalNetSalary)}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        sx={{ marginTop: "20px", marginRight: "10px" }}
      >
        Download PDF
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={generateExcel}
        sx={{ marginTop: "20px" }}
      >
        Download Excel
      </Button>
    </Box>
  );
}

export default MonthSalaryPermanent;