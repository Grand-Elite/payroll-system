import React, { useEffect, useState } from "react";
import { fetchEmployees, getMonthlySalaryDetailsForAll } from "../../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { NotoSansSinhalaBase64 } from "./fonts"; // Import the Base64 string
import { Button } from "@mui/material"; // Add this import statement at the top of your file



function EpfGenerater({ selectedMonth, selectedYear }) {
  const [employees, setEmployees] = useState([]);
  const [salaryData, setSalaryData] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingSalaryDetails, setLoadingSalaryDetails] = useState(false);
  const [setSalaryDetailsNotFound] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const employeeList = await fetchEmployees();
        const activeEmployees = employeeList.filter(
          (employee) => employee.epfNo && employee.status === "ACTIVE"
        );
        setEmployees(activeEmployees);
      } catch (error) {
        console.error("Error loading employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  useEffect(() => {
    const loadSalaryDetails = async () => {
      setLoadingSalaryDetails(true);
      try {
        const salaryDetails = await getMonthlySalaryDetailsForAll(selectedYear, selectedMonth);
        if (salaryDetails.length === 0) {
          setSalaryDetailsNotFound(true);
        } else {
          const salaryDataTemp = {};
          salaryDetails.forEach((detail) => {
            if (detail.employee && detail.employee.employeeId) {
              salaryDataTemp[detail.employee.employeeId] = {
                epfEmployeeAmount: detail.epfEmployeeAmount || "0",
                epfCompanyAmount: detail.epfCompanyAmount || "0",
                epfTotal: detail.epfTotal || "0",
                totalForEpf: detail.totalForEpf || "0",
              };
            }
          });
          setSalaryData(salaryDataTemp);
        }
      } catch (error) {
        console.error("Error loading salary details:", error);
      } finally {
        setLoadingSalaryDetails(false);
      }
    };

    if (employees.length > 0) {
      loadSalaryDetails();
    }
  }, [employees, selectedYear, selectedMonth, setSalaryDetailsNotFound]); // Added setSalaryDetailsNotFound to the dependency array


  const formatAmount = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "0.00";
    return parseFloat(value).toFixed(2);
  };


  const generatePDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");

    doc.addFileToVFS("NotoSansSinhala.ttf", NotoSansSinhalaBase64);
    doc.addFont("NotoSansSinhala.ttf", "NotoSansSinhala", "normal");
    doc.setFont("NotoSansSinhala");

    doc.setFontSize(16);
    doc.text("අධිකාරි සේවක අර්ථ සාධක අරමුදල", 14, 20);

    const tableHeaders = [
      [
        { content: "සේවකයාගේ නම / Employee's Name", rowSpan: 2 },
        { content: "ජා.හැ.ප. අංකය / NIC No.", rowSpan: 2 },
        { content: "සාමාජික අංකය / Member No.", rowSpan: 2 },
        { content: "දායක දීමනා (රු:) / Contributions (Rs.)", colSpan: 3 },
        { content: "මුළු ඉපයීම් / Total Earnings", rowSpan: 2 },
      ],
      [
        { content: "සේවකයා / Employee" },
        { content: "සේව්‍යයා / Employer" },
        { content: "එකතුව / Total" },
      ],
    ];

    const tableRows = employees.map((employee) => {
      const details = salaryData[employee.employeeId] || {};
      return [
        employee.fullName,
        employee.nicNo,
        employee.epfNo,
        details.epfEmployeeAmount || "0",
        details.epfCompanyAmount || "0",
        details.epfTotal || "0",
        details.totalForEpf || "0",
      ];
    });

    tableRows.push([
      {
        content:
          "ඉහත සඳහන් විස්තර නිවැරදි බව තහවුරු කරමි. \nI certify that the information given above is correct.",
        colSpan: 3,
        styles: { halign: "left" },
      },
      "-", "-", "-", "-", "-", "-",
    ]);

    doc.autoTable({
      head: tableHeaders,
      body: tableRows,
      startY: 30,
      margin: { top: 30, left: 14, right: 14 },
      headStyles: {
        font: "NotoSansSinhala",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        font: "NotoSansSinhala",
        textColor: [0, 0, 0],
        halign: "center",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 40 },
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const pageText = `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`;
        doc.setFontSize(10);
        doc.text(pageText, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      },
    });

    doc.save("Employee_Details.pdf");
  };

  return (
    <div>
      <header>
        <h2>අධිකාරි සේවක අර්ථ සාධක අරමුදල</h2>
      </header>
      {loadingEmployees ? (
        <p>Loading employees...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>සේවකයාගේ නම / Employee's Name</th>
              <th rowSpan={2}>ජා.හැ.ප. අංකය / NIC No.</th>
              <th rowSpan={2}>සාමාජික අංකය / Member No.</th>
              <th colSpan={3}>දායක දීමනා (රු:) / Contributions (Rs.)</th>
              <th rowSpan={2}>මුළු ඉපයීම් / Total Earnings</th>
            </tr>
            <tr>
              <th>එකතුව / Total</th>
              <th>සේව්‍යයා / Employer</th>
              <th>සේවකයා / Employee</th>
            </tr>
          </thead>
          <tbody>
  {employees.length > 0 ? (
    employees.map((employee) => {
      const details = salaryData[employee.employeeId] || {};
      return (
        <tr key={employee.employeeId}>
          <td style={{ textAlign: "left" }}>{employee.fullName}</td>
          <td>{employee.nicNo}</td>
          <td>{employee.epfNo}</td>
          <td>{formatAmount(details.epfTotal || "0")}</td>
          <td>{formatAmount(details.epfCompanyAmount || "0.00")}</td>
          <td>{formatAmount(details.epfEmployeeAmount || "0.00")}</td>
          <td>{formatAmount(details.totalForEpf || "0")}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>No Data</td>
    </tr>
  )}
  {/* Calculate totals */}
  <tr>
    <td colSpan="2" style={{ textAlign: "left"}}>
      ඉහත සඳහන් විස්තර නිවැරදි බව තහවුරු කරමි. <br/> I certify that the information given above is correct.
    </td>
    <td style={{ textAlign: "left", fontWeight: "bold" }}>
      එකතුව (Page 1) <br /> Total 
    </td>
    <td>{formatAmount(employees.reduce((sum, employee) => sum + (salaryData[employee.employeeId]?.epfTotal || 0), 0))}</td>
    <td>{formatAmount(employees.reduce((sum, employee) => sum + (salaryData[employee.employeeId]?.epfCompanyAmount || 0), 0))}</td>
    <td>{formatAmount(employees.reduce((sum, employee) => sum + (salaryData[employee.employeeId]?.epfEmployeeAmount || 0), 0))}</td> 
  </tr>
</tbody>

        </table>
      )}
      {loadingSalaryDetails && <p>Loading salary details...</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        sx={{ marginTop: "20px" }}
      >
        Download PDF
      </Button>
    </div>
  );
}

export default EpfGenerater;
