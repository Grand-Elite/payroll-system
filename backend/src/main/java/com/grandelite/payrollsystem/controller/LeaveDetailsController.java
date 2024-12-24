package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.EmployeeYearlyLeaveEligibility;
import com.grandelite.payrollsystem.repository.EmployeeYearlyLeaveEligibilityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LeaveDetailsController {

    private final EmployeeYearlyLeaveEligibilityRepository repository;

    public LeaveDetailsController(EmployeeYearlyLeaveEligibilityRepository repository) {
        this.repository = repository;
    }

    // Existing GET endpoint for fetching leave details
    @GetMapping("/leave-details")
    public ResponseEntity<?> getLeaveDetails(@RequestParam("employeeId") Long employeeId,
                                             @RequestParam("year") String year) {
        Optional<EmployeeYearlyLeaveEligibility> leaveDetails =
                repository.findByEmployeeIdAndYear(employeeId, year);

        if (leaveDetails.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Leave details not found for employee " + employeeId + " and year " + year);
        }
        return ResponseEntity.ok(leaveDetails.get());
    }


    @PostMapping("/leave-details")
    public ResponseEntity<String> saveLeaveDetails(@RequestBody EmployeeYearlyLeaveEligibility leaveDetails) {
        try {
            // Validate input
            if (leaveDetails == null || leaveDetails.getEmployee() == null ||
                    leaveDetails.getEmployee().getEmployeeId() == null ||
                    leaveDetails.getYear() == null || leaveDetails.getYear().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input data");
            }

            Long employeeId = leaveDetails.getEmployee().getEmployeeId(); // Extract employeeId from the Employee object
            String year = leaveDetails.getYear();

            // Generate leaveRecordId in the format "employeeId:year"
            String leaveRecordId = employeeId + ":" + year;
            leaveDetails.setLeaveRecordId(leaveRecordId); // Set the generated leaveRecordId

            // Check if leave details already exist
            Optional<EmployeeYearlyLeaveEligibility> existingLeaveDetails =
                    repository.findById(leaveRecordId); // Use leaveRecordId for lookup

            if (existingLeaveDetails.isPresent()) {
                // Update existing leave details
                EmployeeYearlyLeaveEligibility existingDetails = existingLeaveDetails.get();
                existingDetails.setAnnual(leaveDetails.getAnnual());
                existingDetails.setCasual(leaveDetails.getCasual());
                existingDetails.setMedical(leaveDetails.getMedical());
                repository.save(existingDetails);
            } else {
                // Save new leave details
                repository.save(leaveDetails);
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
