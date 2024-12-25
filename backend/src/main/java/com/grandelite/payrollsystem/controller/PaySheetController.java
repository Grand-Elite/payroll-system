package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.service.PaySheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api")
public class PaySheetController {

    @Autowired
    private PaySheetService paySheetService;

    @GetMapping("/pay-sheet/year/{year}/month/{month}")
    public ResponseEntity<byte[]> getAllPaySheets
            (
             @PathVariable String year,
             @PathVariable String month) {
        ByteArrayOutputStream baos = paySheetService.getAllPaySheets(year,month);
        String fileName = "pay-sheets-"+year+"-"+month+".pdf";
        // Set headers for PDF response
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="+fileName);
        headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
    }

    @GetMapping("/employee/{employeeId}/pay-sheet/year/{year}/month/{month}")
    public ResponseEntity<byte[]> getPaySheet
            (@PathVariable Long employeeId,
             @PathVariable String year,
             @PathVariable String month) {
        ByteArrayOutputStream baos = paySheetService.getEmployeePaySheet(employeeId,year,month);
        String fileName = "pay-sheet-"+employeeId+"-"+year+"-"+month+".pdf";
        // Set headers for PDF response
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="+fileName);
        headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
    }
}
