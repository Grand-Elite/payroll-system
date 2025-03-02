package com.grandelite.payrollsystem.service.impl;
import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.MonthlyFullSalaryRepository;
import com.grandelite.payrollsystem.service.PaySheetService;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.utils.PdfMerger;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.DashedBorder;
import com.itextpdf.layout.borders.DoubleBorder;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.List;

@Service
public class PaySheetServiceImpl implements PaySheetService {

    @Autowired
    MonthlyFullSalaryRepository monthlyFullSalaryRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Override
    public ByteArrayOutputStream getAllPaySheets(String year, String month) {
        List<Employee> employees = employeeRepository.findAll();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument mergedPdf = new PdfDocument(writer);
            PdfMerger merger = new PdfMerger(mergedPdf);

            for (Employee employee : employees) {
                MonthlyFullSalary mfs = monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employee.getEmployeeId(), year, month);
                if (mfs != null) {
                    PdfDocument inMemoryPdf = new PdfDocument(new PdfReader(
                            new java.io.ByteArrayInputStream(
                                    generateEmployeePaySheetByteStream(employee, mfs)
                                            .toByteArray())
                    ));
                    merger.merge(inMemoryPdf, 1, inMemoryPdf.getNumberOfPages());
                    inMemoryPdf.close();
                }
            }

            mergedPdf.close();
            return baos;
        } catch (IOException e) {
            return null;
        }
    }

    @Override
    public ByteArrayOutputStream getEmployeePaySheet(Long employeeId, String year, String month) {
        Employee employee = employeeRepository.getReferenceById(employeeId);
        MonthlyFullSalary mfs = monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employeeId, year, month);

        return generateEmployeePaySheetByteStream(employee, mfs);
    }

    private ByteArrayOutputStream generateEmployeePaySheetByteStream(Employee employee, MonthlyFullSalary mfs) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PageSize pageSize = PageSize.A6;
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDocument = new PdfDocument(writer);
            pdfDocument.setDefaultPageSize(pageSize);
            Document document = new Document(pdfDocument);

            if (employee.getEpfNo() != null) {
                InputStream imageStream = getClass().getClassLoader().getResourceAsStream("icons/grand-elite.ico");
                Image img = new Image(ImageDataFactory.create(imageStream.readAllBytes()));
                img.scaleToFit(25, 25);
                document.add(img.setFixedPosition(35, pageSize.getTop() - 65));
                document.add(new Paragraph("Grand Elite")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setFontSize(5));
            }

            document.add(new Paragraph("Paysheet")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(5)
                    .setUnderline());

            document.add(getEmployeeSalaryTable(employee, mfs));
            document.close();
            return baos;
        } catch (IOException e) {
            return null;
        }
    }

    private Table getEmployeeSalaryTable(Employee employee, MonthlyFullSalary mfs) {
        int numColumns = 3;
        Table table = new Table(numColumns);
        table.setBorder(null);

        table.addCell(getCell("Employee Name"));
        table.addCell(getCell(":"));
        table.addCell(getCell(employee.getFullName()));

        table.addCell(getCell("EPF No."));
        table.addCell(getCell(":"));
        table.addCell(getCell(employee.getEpfNo() != null ? String.format("%d", Double.valueOf(employee.getEpfNo()).longValue()) : ""));

        table.addCell(getCell("Year/Month"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getYear() + "/" + mfs.getMonth()));

        table.addCell(getCell("Basic+BR1+BR2"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getBasic()));

        table.addCell(getCell("No Pay"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getNoPayAmount()));

        table.addCell(getCell("Arrears"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getArrears()));

        table.addCell(getCell("Total For EPF"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getTotalForEpf()));

        table.addCell(getCell("Bonus"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getBonus()));

        table.addCell(getCell("OT payment 1"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getOt1()));

        table.addCell(getCell("OT payment 2"));
        table.addCell(getCell(":"));
        table.addCell(getCellSingleBorder(mfs.getOt2()));

        table.addCell(getCell("Gross Pay"));
        table.addCell(getCell(":"));
        table.addCell(getCellSingleBorder(mfs.getGrossPay()));

        table.addCell(getCell("Attendance/ Transport Allowance"));
        table.addCell(getCell(":"));
        table.addCell(getCell((mfs.getAttendanceAllowance() + mfs.getTransportAllowance())));

        table.addCell(getCell("Performance Allowance"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getPerformanceAllowance()));

        table.addCell(getCell("Encouragement Allowance"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getMonthEncouragementAllowance()));

        table.addCell(getCell("Incentive"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getIncentives()));

        table.addCell(getCell("Total Allowance"));
        table.addCell(getCell(":"));
        table.addCell(getCellSingleBorder(mfs.getTotalAllowance()));

        table.addCell(getCell("Total Monthly Salary"));
        table.addCell(getCell(":"));
        table.addCell(getCellSingleBorder(mfs.getTotalMonthlySalary()));

        table.addCell(getCell("Salary Advance"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getSalaryAdvance()));

        table.addCell(getCell("Late Charges"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getLateCharges()));

        table.addCell(getCell("Deductions"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getOtherDeductions()));

        table.addCell(getCell("Food Bill"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getFoodBill()));

        table.addCell(getCell("Total Deduction"));
        table.addCell(getCell(":"));
        table.addCell(getCellSingleBorder(mfs.getTotalDeduction()));

        table.addCell(getCell("Net Salary"));
        table.addCell(getCell(":"));
        table.addCell(getCellSingleBorder(mfs.getNetSalary()));

        // Only add EPF-related rows if EPF No. is not null
        if (employee.getEpfNo() != null) {
            table.addCell(getCell("EPF 8%"));
            table.addCell(getCell(":"));
            table.addCell(getCell(mfs.getEpfEmployeeAmount()));

            table.addCell(getCell("EPF Total"));
            table.addCell(getCell(":"));
            table.addCell(getCell(mfs.getEpfTotal()));

            table.addCell(getCell("Company Contribution EPF 12%"));
            table.addCell(getCell(":"));
            table.addCell(getCell(mfs.getEpfCompanyAmount()));

            table.addCell(getCell("Company Contribution ETF 3%"));
            table.addCell(getCell(":"));
            table.addCell(getCellSingleBorder(mfs.getEtfCompanyAmount()));
        }
        return table;
    }

    private Cell getCell(Double dblValue) {
        DecimalFormat df = new DecimalFormat("#.00");
        String formattedValue;

        if (dblValue == null) {
            formattedValue = "-"; // or any default placeholder
        } else {
            formattedValue = df.format(dblValue);
        }

        return new Cell().add(new Paragraph(formattedValue)
                        .setFontSize(5)
                        .setTextAlignment(TextAlignment.RIGHT))
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setBorderTop(Border.NO_BORDER)
                .setBorderBottom(new DashedBorder(0.1f));
    }

    private Cell getCellDoubleBorder(Double dblValue) {
        DecimalFormat df = new DecimalFormat("#.00");
        String formattedValue;

        try {
            if (dblValue == null) {
                formattedValue = "-"; // Default placeholder for null values
            } else {
                formattedValue = df.format(dblValue); // Format the valid number
            }
        } catch (IllegalArgumentException e) {
            formattedValue = "-"; // Fallback for unexpected formatting issues
        }

        return new Cell().add(new Paragraph(
                        formattedValue
                ).setTextAlignment(TextAlignment.RIGHT))
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setBorderTop(Border.NO_BORDER)
                .setBorderBottom(new DoubleBorder(1))
                .setFontSize(5);
    }


    private Cell getCellSingleBorder(Double dblValue) {
        DecimalFormat df = new DecimalFormat("#.00");
        String formattedValue;

        try {
            if (dblValue == null) {
                formattedValue = "-"; // Default placeholder for null values
            } else {
                formattedValue = df.format(dblValue); // Format the valid number
            }
        } catch (IllegalArgumentException e) {
            formattedValue = "-"; // Fallback for unexpected formatting issues
        }

        return new Cell().add(new Paragraph(
                        formattedValue
                ).setTextAlignment(TextAlignment.RIGHT))
                .setBorderLeft(Border.NO_BORDER) // Remove left border
                .setBorderRight(Border.NO_BORDER) // Remove right border
                .setBorderTop(Border.NO_BORDER) // Remove top border
                .setBorderBottom(new SolidBorder(0.1f)) // Add single bottom border
                .setFontSize(5);
    }

    private Cell getCell(String str) {
        return new Cell().add(new Paragraph(str).setFontSize(5))
                .setBorder(null);
    }
}



