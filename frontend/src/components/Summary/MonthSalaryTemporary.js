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
import { fetchEmployees, getMonthlySalaryDetailsForAll } from "../../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

function MonthSalaryPermanent({ selectedYear, selectedMonth }) {
  const [employees, setEmployees] = useState([]);
  const [salaryData, setSalaryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const employeeList = await fetchEmployees();
        const filteredEmployees = employeeList.filter(
          (employee) => employee.epfNo === null && employee.status === "ACTIVE"
        ); // Filter employees with non-null epfNo
        setEmployees(filteredEmployees);

        const salaryDetails = await getMonthlySalaryDetailsForAll(
          selectedYear,
          selectedMonth
        );
        console.log(salaryDetails)
        const salaryDataTemp = {};
        salaryDetails.forEach((detail) => {
          if (detail.employee && detail.employee.employeeId) {
            salaryDataTemp[detail.employee.employeeId] = detail;
          }
        });
        setSalaryData(salaryDataTemp);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedMonth, selectedYear]);
  
  const formatAmount = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "0.00";
    return parseFloat(value).toFixed(2);
  };
  
  // Define the salary attributes keys
  const salaryAttributes = {
    basic: "Basic+BR1+BR2",
    noPayAmount: "No Pay Amount",
    totalForEpf: "Total For EPF",
    otHours: "OT Hours", // Add OT Hours column
    ot1: "OT-1 Amount",
    ot2: "OT-2 Amount",
    attendanceTransportAllowance: "Attendance/Transport Allowance", // Combined column
    performanceAllowance: "Performance Allowance",
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
    doc.text(`${selectedMonth}`, 14,36);
    doc.text(`-${selectedYear}`,45,36);

    const tableData = employees.map((employee) => {
      const row = [employee.epfNo, employee.fullName];
      row.push(formatAmount(employee.attendance ?? "0"));
      row.push(formatAmount(employee.noPayLeaves ?? "0"));
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
        13: { fontStyle: "bold" },
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,
      margin: { top: 25, left: 10, right: 10, bottom: 10 },
      pageBreak: "auto",
    });

    doc.save(`monthly-salary-payments-temporary-staff-${selectedYear}-${selectedMonth}.pdf`);
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
                <TableCell>EPF No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>No Pay Leaves</TableCell>
                {Object.values(salaryAttributes).map((label) => (
                  <TableCell
                    key={label}
                    style={{
                      fontWeight:
                        label === "Total Monthly Salary" ? "bold" : "normal",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
                <TableCell>Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{employee.epfNo}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.attendance ?? "0"}</TableCell>
                  <TableCell>{employee.noPayLeaves ?? "0"}</TableCell>
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

      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        sx={{ marginTop: "20px" }}
      >
        Download PDF
      </Button>
    </Box>
  );
}

export default MonthSalaryPermanent;