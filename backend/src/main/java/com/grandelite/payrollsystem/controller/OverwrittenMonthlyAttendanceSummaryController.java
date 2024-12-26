package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.OverwrittenMonthlyAttendanceSummary;
import com.grandelite.payrollsystem.repository.OverwrittenMonthlyAttendanceSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance-summary")
public class OverwrittenMonthlyAttendanceSummaryController {

    @Autowired
    private OverwrittenMonthlyAttendanceSummaryRepository repository;

    @PostMapping("/save")
    public ResponseEntity<String> saveAdjustedAttendanceSummary(
            @RequestParam("employeeId") String employeeId,
            @RequestParam("year") String year,
            @RequestParam("month") String month,
            @RequestParam("adjustedLateTime") Long adjustedLateTime,
            @RequestParam("adjustedOtHours") Long adjustedOtHours) {

        String recordId = employeeId + ":" + year + ":" + month;

        // Create the OverwrittenMonthlyAttendanceSummary object
        OverwrittenMonthlyAttendanceSummary attendanceSummary = new OverwrittenMonthlyAttendanceSummary();
        attendanceSummary.setOverwrittenMonthlyAttendanceRecordId(recordId);
        attendanceSummary.setAdjustedLateTime(adjustedLateTime);
        attendanceSummary.setAdjustedOtHours(adjustedOtHours);
        attendanceSummary.setYear(year);
        attendanceSummary.setMonth(month);

        // Assuming you have a method to fetch Employee by ID
        Employee employee = new Employee();
        employee.setEmployeeId(Long.valueOf(employeeId)); // Replace with actual retrieval if required
        attendanceSummary.setEmployee(employee);

        // Save to the database
        repository.save(attendanceSummary);

        return ResponseEntity.ok("Attendance summary saved successfully.");
    }
}
