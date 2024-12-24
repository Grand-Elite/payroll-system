package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.EmployeeMonthlyLeaveUsage;
import com.grandelite.payrollsystem.repository.EmployeeMonthlyLeaveUsageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LeaveUsageController {

    private final EmployeeMonthlyLeaveUsageRepository repository;

    public LeaveUsageController(EmployeeMonthlyLeaveUsageRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/leave-usage")
    public ResponseEntity<String> saveLeaveUsage(@RequestBody EmployeeMonthlyLeaveUsage leaveUsage) {
        try {
            // Validate input
            if (leaveUsage == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Leave usage data cannot be null");
            }

            if (leaveUsage.getEmployee() == null || leaveUsage.getEmployee().getEmployeeId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Employee and Employee ID cannot be null");
            }

            if (leaveUsage.getYear() == null || leaveUsage.getYear().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Year is required");
            }

            if (leaveUsage.getMonth() == null || leaveUsage.getMonth().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Month is required");
            }

            // Ensure all fields are not null and set defaults if necessary
            leaveUsage.setAnnualLeaves(leaveUsage.getAnnualLeaves() != null ? leaveUsage.getAnnualLeaves() : 0L);
            leaveUsage.setMedical(leaveUsage.getMedical() != null ? leaveUsage.getMedical() : 0L);
            leaveUsage.setCasual(leaveUsage.getCasual() != null ? leaveUsage.getCasual() : 0L);
            leaveUsage.setAbOnPublicHoliday(leaveUsage.getAbOnPublicHoliday() != null ? leaveUsage.getAbOnPublicHoliday() : 0L);
            leaveUsage.setOther(leaveUsage.getOther() != null ? leaveUsage.getOther() : 0L);
            leaveUsage.setNoPayLeaves(leaveUsage.getNoPayLeaves() != null ? leaveUsage.getNoPayLeaves() : 0L);
            leaveUsage.setMonthlyMandatoryLeaves(leaveUsage.getMonthlyMandatoryLeaves() != null ? leaveUsage.getMonthlyMandatoryLeaves() : 0L);

            Long employeeId = leaveUsage.getEmployee().getEmployeeId(); // Extract employeeId
            String year = leaveUsage.getYear();
            String month = leaveUsage.getMonth();

            // Generate leaveUsageId in the format "employeeId:year:month"
            String leaveUsageId = employeeId + ":" + year + ":" + month;
            leaveUsage.setLeaveUsageId(leaveUsageId); // Set the generated leaveUsageId

            // Check if leave details already exist
            Optional<EmployeeMonthlyLeaveUsage> existingLeaveUsage = repository.findById(leaveUsageId);

            if (existingLeaveUsage.isPresent()) {
                // Update existing leave details
                EmployeeMonthlyLeaveUsage existingDetails = existingLeaveUsage.get();
                existingDetails.setAnnualLeaves(leaveUsage.getAnnualLeaves());
                existingDetails.setCasual(leaveUsage.getCasual());
                existingDetails.setMedical(leaveUsage.getMedical());
                existingDetails.setAbOnPublicHoliday(leaveUsage.getAbOnPublicHoliday());
                existingDetails.setOther(leaveUsage.getOther());
                existingDetails.setNoPayLeaves(leaveUsage.getNoPayLeaves());
                existingDetails.setMonthlyMandatoryLeaves(leaveUsage.getMonthlyMandatoryLeaves());
                repository.save(existingDetails); // Save updated details
            } else {
                // Save new leave details
                repository.save(leaveUsage);
            }

            return ResponseEntity.ok("Leave details saved successfully!");
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving leave details: " + e.getMessage());
        }
    }
}
