package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.OverwrittenMonthlyAttendanceSummary;
import com.grandelite.payrollsystem.repository.OverwrittenMonthlyAttendanceSummaryRepository;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService; // Assuming this is the service interface for salary calculation
import com.grandelite.payrollsystem.service.OverwrittenMonthlyAttendanceSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Month;

@Service
public class OverwrittenMonthlyAttendanceSummaryServiceImpl implements OverwrittenMonthlyAttendanceSummaryService {

    @Autowired
    private OverwrittenMonthlyAttendanceSummaryRepository repository;

    @Autowired
    private MonthlyFullSalaryService monthlyFullSalaryService; // Inject the salary calculation service

    @Override
    public ResponseEntity<String> saveAdjustedAttendanceSummary(
            String employeeId, String year, String month, Long adjustedLateTime, Long adjustedOtHours) {

        // Validate parameters
        if (employeeId == null || year == null || month == null) {
            return ResponseEntity.badRequest().body("Employee ID, year, and month are required.");
        }

        // Parse employee ID
        Long empId;
        try {
            empId = Long.valueOf(employeeId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid Employee ID.");
        }

        // Create recordId
        String recordId = employeeId + ":" + year + ":" + month;

        // Build OverwrittenMonthlyAttendanceSummary object
        OverwrittenMonthlyAttendanceSummary attendanceSummary = new OverwrittenMonthlyAttendanceSummary();
        attendanceSummary.setOverwrittenMonthlyAttendanceRecordId(recordId);
        attendanceSummary.setAdjustedLateTime(adjustedLateTime);
        attendanceSummary.setAdjustedOtHours(adjustedOtHours);
        attendanceSummary.setYear(year);
        attendanceSummary.setMonth(month);

        Employee employee = new Employee();
        employee.setEmployeeId(empId);
        attendanceSummary.setEmployee(employee);

        // Save to the database
        repository.save(attendanceSummary);

        // Call the salary calculation service
        monthlyFullSalaryService.calculateMonthlyFullSalary(employee.getEmployeeId(),year, Month.valueOf(month.toUpperCase()).getValue());

        return ResponseEntity.ok("Attendance summary saved successfully.");
    }


    @Override
    public ResponseEntity<Object> getAdjustedAttendanceSummary(Long employeeId, String year, String month) {
        // Fetch the attendance summary
        Object attendanceSummary = repository.findByEmployeeIdAndYearAndMonth(employeeId, year, month).orElse(null);

        if (attendanceSummary == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(attendanceSummary);
    }
}
