package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.model.AttendanceSummary;
import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.OverwrittenAttendanceStatus;
import com.grandelite.payrollsystem.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/attendance/upload-excel")
    public ResponseEntity<String> uploadExcelFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()  || !file.getOriginalFilename().endsWith(".csv")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file. Please upload an Excel file.");
        }

        String responseMessage = attendanceService.processExcelFile(file);
        return ResponseEntity.ok(responseMessage);
    }

    @GetMapping("/employee/{employeeId}/attendance/{year}/{month}")
    public List<Attendance> findAttendanceByEmployeeId(@PathVariable Long employeeId,
                                                       @PathVariable String year,
                                                       @PathVariable String month) {
        return attendanceService.findAttendanceByEmployeeId(employeeId,year,month);
    }

    @PatchMapping("/employee/{employeeId}/attendance/{date}/overwritten-attendance")
    public ResponseEntity<OverwrittenAttendanceStatus> overwriteAttendanceStatus(@PathVariable Long employeeId,
                                                                 @PathVariable LocalDate date,
                                                                 @RequestBody OverwrittenAttendanceStatus overwrittenAttendanceStatus){
        return ResponseEntity.ok(attendanceService.overwriteAttendanceStatus(employeeId,date,overwrittenAttendanceStatus));
    }

    @GetMapping("/employee/{employeeId}/attendance-summary/{year}/{month}")
    public AttendanceSummary findAttendanceSummaryByEmployeeId(@PathVariable Long employeeId,
                                                               @PathVariable String year,
                                                               @PathVariable String month) {
        return attendanceService.findAttendanceSummaryByEmployeeId(employeeId,year,month);
    }

}