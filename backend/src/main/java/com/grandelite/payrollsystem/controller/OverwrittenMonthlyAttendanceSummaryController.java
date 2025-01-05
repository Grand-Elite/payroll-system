//package com.grandelite.payrollsystem.controller;
//
//import com.grandelite.payrollsystem.model.Employee;
//import com.grandelite.payrollsystem.model.OverwrittenMonthlyAttendanceSummary;
//import com.grandelite.payrollsystem.repository.OverwrittenMonthlyAttendanceSummaryRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/attendance-summary")
//public class OverwrittenMonthlyAttendanceSummaryController {
//
//    @Autowired
//    private OverwrittenMonthlyAttendanceSummaryRepository repository;
//
//    @PostMapping("/save")
//    public ResponseEntity<String> saveAdjustedAttendanceSummary(
//            @RequestParam("employeeId") String employeeId,
//            @RequestParam("year") String year,
//            @RequestParam("month") String month,
//            @RequestParam(value = "adjustedLateTime", defaultValue = "0") Long adjustedLateTime,
//            @RequestParam(value = "adjustedOtHours", defaultValue = "0") Long adjustedOtHours) {
//
//        // Validate parameters if needed
//        if (employeeId == null || year == null || month == null) {
//            return ResponseEntity.badRequest().body("Employee ID, year, and month are required.");
//        }
//
//        // Ensure that employeeId is parsed as a Long
//        Long empId;
//        try {
//            empId = Long.valueOf(employeeId);
//        } catch (NumberFormatException e) {
//            return ResponseEntity.badRequest().body("Invalid Employee ID.");
//        }
//
//        // Create the OverwrittenMonthlyAttendanceSummary object
//        String recordId = employeeId + ":" + year + ":" + month;
//
//        OverwrittenMonthlyAttendanceSummary attendanceSummary = new OverwrittenMonthlyAttendanceSummary();
//        attendanceSummary.setOverwrittenMonthlyAttendanceRecordId(recordId);
//        attendanceSummary.setAdjustedLateTime(adjustedLateTime);
//        attendanceSummary.setAdjustedOtHours(adjustedOtHours);
//        attendanceSummary.setYear(year);
//        attendanceSummary.setMonth(month);
//
//        Employee employee = new Employee();
//        employee.setEmployeeId(empId); // Using Long value directly
//        attendanceSummary.setEmployee(employee);
//
//        // Save to the database
//        repository.save(attendanceSummary);
////        monthlyFullSalaryService.calculateMonthlyFullSalary(employee.getEmployeeId(),yearMonth.getYear(),yearMonth.getMonth());
//
//        return ResponseEntity.ok("Attendance summary saved successfully.");
//    }
//
//
//    @GetMapping
//    public ResponseEntity<Object> getAdjustedAttendanceSummary(@RequestParam("employeeId") Long employeeId,
//                                                       @RequestParam("year") String year,
//                                                       @RequestParam("month") String month) {
//        // Find the attendance summary by recordId
//        Object attendanceSummary = repository.findByEmployeeIdAndYearAndMonth(employeeId, year, month).orElse(null);
//
//        if (attendanceSummary == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(attendanceSummary);
//    }
//}


package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.service.OverwrittenMonthlyAttendanceSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance-summary")
public class OverwrittenMonthlyAttendanceSummaryController {

    @Autowired
    private OverwrittenMonthlyAttendanceSummaryService attendanceSummaryService;

    @PostMapping("/save")
    public ResponseEntity<String> saveAdjustedAttendanceSummary(
            @RequestParam("employeeId") String employeeId,
            @RequestParam("year") String year,
            @RequestParam("month") String month,
            @RequestParam(value = "adjustedLateTime", defaultValue = "0") Long adjustedLateTime,
            @RequestParam(value = "adjustedOtHours", defaultValue = "0") Long adjustedOtHours) {
        return attendanceSummaryService.saveAdjustedAttendanceSummary(employeeId, year, month, adjustedLateTime, adjustedOtHours);
    }

    @GetMapping
    public ResponseEntity<Object> getAdjustedAttendanceSummary(@RequestParam("employeeId") Long employeeId,
                                                               @RequestParam("year") String year,
                                                               @RequestParam("month") String month) {
        return attendanceSummaryService.getAdjustedAttendanceSummary(employeeId, year, month);
    }
}


