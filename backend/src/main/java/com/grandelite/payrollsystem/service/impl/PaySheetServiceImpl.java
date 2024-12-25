package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.MonthlyFullSalaryRepository;
import com.grandelite.payrollsystem.service.PaySheetService;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.utils.PdfMerger;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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
            mergedPdf.setDefaultPageSize(PageSize.A4);

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
            // Create a PDF writer and document
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            // Add content to the PDF
            document.add(new Paragraph("__Paysheet__"));

            Table table = getEmployeeSalaryTable(employee, mfs);

            // Add the table to the document
            document.add(table);

            // Close the document
            document.close();
            return baos;
        }catch (IOException e){
            return null;
        }
    }

    private Table getEmployeeSalaryTable(Employee employee, MonthlyFullSalary mfs) {
        // Define the number of columns for the table
        int numColumns = 2;

        // Create a table with specified number of columns
        Table table = new Table(numColumns);

        // Add table rows
        table.addCell(new Cell().add(new Paragraph("Employee Name:")));
        table.addCell(new Cell().add(new Paragraph(employee.getFullName())));

        table.addCell(new Cell().add(new Paragraph("Month:")));
        table.addCell(new Cell().add(new Paragraph(mfs.getMonth())));

        table.addCell(new Cell().add(new Paragraph("Total Monthly Salary:")));
        table.addCell(new Cell().add(new Paragraph(String.valueOf(mfs.getTotalMonthlySalary()))));
        return table;
    }
}
