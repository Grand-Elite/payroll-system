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
            // Create a PDF writer and document
            PdfWriter writer = new PdfWriter(baos);
            // Create PdfDocument for the output file
            PdfDocument mergedPdf = new PdfDocument(writer);

            // Create PdfMerger instance
            PdfMerger merger = new PdfMerger(mergedPdf);

            for(Employee employee:employees){
                MonthlyFullSalary mfs =
                        monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employee.getEmployeeId(), year, month);
                if(mfs!=null) {
                    // Merge the in-memory PDF into the final merged PDF
                    PdfDocument inMemoryPdf = new PdfDocument(new PdfReader(
                            new java.io.ByteArrayInputStream(
                                    generateEmployeePaySheetByteStream(employee,mfs)
                                            .toByteArray())
                    ));
                    merger.merge(inMemoryPdf, 1, inMemoryPdf.getNumberOfPages());
                    inMemoryPdf.close();
                }
            }

            // Close the merged PDF
            mergedPdf.close();

            return baos;
        }catch (IOException e){
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
            // Create a PDF writer and document
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDocument = new PdfDocument(writer);
            pdfDocument.setDefaultPageSize(pageSize);
            Document document = new Document(pdfDocument);

            if(employee.getEpfNo()!=null) {
                InputStream imageStream = getClass().getClassLoader().getResourceAsStream("icons/grand-elite.ico");

                Image img = new Image(ImageDataFactory.create(imageStream.readAllBytes()));

                // Resize image if necessary (optional)
                img.scaleToFit(50, 50); // Width 50px, height 50px

                // Add image to the document (set position)
                document.add(img.setFixedPosition(35, pageSize.getTop() - 65));
                document.add(new Paragraph("Grand Elite")
                        .setTextAlignment(TextAlignment.CENTER) // Align the text to the center
                );
            }

            // Add content to the PDF
            document.add(new Paragraph("Paysheet")
                    .setTextAlignment(TextAlignment.CENTER) // Align the text to the center
                    .setUnderline());

            // Add the table to the document
            document.add(getEmployeeSalaryTable(employee, mfs));

            // Close the document
            document.close();
            return baos;
        }catch (IOException e){
            return null;
        }
    }

    private Table getEmployeeSalaryTable(Employee employee, MonthlyFullSalary mfs) {
        // Define the number of columns for the table
        int numColumns = 3;

        // Create a table with specified number of columns
        Table table = new Table(numColumns);

        // Set table border to none
        table.setBorder(null); // This removes the border from the entire table

        // Add table rows
        table.addCell(getCell("Employee Name"));
        table.addCell(getCell(":"));
        table.addCell(getCell(employee.getFullName()));

        table.addCell(getCell("Year/Month"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getYear()+"/"+mfs.getMonth()));

        table.addCell(getCell("Basic Salary"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getBasic()));

        table.addCell(getCell("Total Monthly Salary"));
        table.addCell(getCell(":"));
        table.addCell(getCell(mfs.getTotalMonthlySalary()));

        table.addCell(getCell("Net Salary"));
        table.addCell(getCell(":"));
        table.addCell(getCellDoubleBorder(mfs.getNetSalary()));
        return table;
    }

    private Cell getCell(Double dblValue) {
        DecimalFormat df = new DecimalFormat("#.00");
        String formattedValue = df.format(dblValue);
        return new Cell().add(new Paragraph(
                formattedValue
        ).setTextAlignment(TextAlignment.RIGHT))
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setBorderTop(Border.NO_BORDER)
                .setBorderBottom(new DashedBorder(1));
    }

    private Cell getCellDoubleBorder(Double dblValue) {
        DecimalFormat df = new DecimalFormat("#.00");
        String formattedValue = df.format(dblValue);
        return new Cell().add(new Paragraph(
                        formattedValue
                ).setTextAlignment(TextAlignment.RIGHT))
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER)
                .setBorderTop(Border.NO_BORDER)
                .setBorderBottom(new DoubleBorder(1));
    }

    private Cell getCell(String str) {
        return new Cell().add(new Paragraph(str)).setBorder(null);
    }
}
