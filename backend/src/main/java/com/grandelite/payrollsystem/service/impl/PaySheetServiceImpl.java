package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.service.PaySheetService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PaySheetServiceImpl implements PaySheetService {
    @Override
    public ByteArrayOutputStream getPaySheet(Long employeeId, String year, String month) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Create a PDF writer and document
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            // Add content to the PDF
            document.add(new Paragraph("Hello, this is a sample PDF generated in memory."));
            document.add(new Paragraph("Spring Boot makes it easy to build web applications!"));

            // Close the document
            document.close();
            return baos;
        }catch (IOException e){
            return null;
        }
    }
}
