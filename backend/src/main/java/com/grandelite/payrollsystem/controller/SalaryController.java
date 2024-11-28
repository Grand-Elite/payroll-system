package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.SalaryRepository;
import com.grandelite.payrollsystem.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/salaryBase")
public class SalaryController {

    private final SalaryService salaryService;
    private final EmployeeRepository employeeRepository;
    private final SalaryRepository salaryRepository;

    // Constructor-based dependency injection
    @Autowired
    public SalaryController(SalaryService salaryService,
                            EmployeeRepository employeeRepository,
                            SalaryRepository salaryRepository) {
        this.salaryService = salaryService;
        this.employeeRepository = employeeRepository;
        this.salaryRepository = salaryRepository;
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<SalaryBase> getSalaryDetailsByEmployeeId(@PathVariable Long employeeId) {
        SalaryBase salaryDetails = salaryService.getSalaryDetailsByEmployeeId(employeeId);
        return ResponseEntity.ok(salaryDetails);
    }

    @PatchMapping("/{employeeId}")
    public ResponseEntity<String> updateSalaryDetails(
            @PathVariable Long employeeId,
            @RequestBody SalaryBase updatedSalaryDetails
    ) {
        Optional<SalaryBase> salaryBaseOptional = salaryRepository.findByEmployeeEmployeeId(employeeId);

        if (salaryBaseOptional.isPresent()) {
            SalaryBase existingSalaryBase = salaryBaseOptional.get();

            // Update the fields directly
            existingSalaryBase.setBasicSalary(updatedSalaryDetails.getBasicSalary());
            existingSalaryBase.setBonus(updatedSalaryDetails.getBonus());
            existingSalaryBase.setAttendanceAllowance(updatedSalaryDetails.getAttendanceAllowance());
            existingSalaryBase.setTransportAllowance(updatedSalaryDetails.getTransportAllowance());
            existingSalaryBase.setPerformanceAllowance(updatedSalaryDetails.getPerformanceAllowance());
            existingSalaryBase.setIncentives(updatedSalaryDetails.getIncentives());
            existingSalaryBase.setSalaryAdvance(updatedSalaryDetails.getSalaryAdvance());
            existingSalaryBase.setFoodBill(updatedSalaryDetails.getFoodBill());
            existingSalaryBase.setArrears(updatedSalaryDetails.getArrears());
            existingSalaryBase.setOtherDeductions(updatedSalaryDetails.getOtherDeductions());
            existingSalaryBase.setOt1Rate(updatedSalaryDetails.getOt1Rate());
            existingSalaryBase.setOt2Rate(updatedSalaryDetails.getOt2Rate());

            salaryRepository.save(existingSalaryBase);
            return ResponseEntity.ok("Salary details updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found.");
        }
    }

    @PostMapping("/{employeeId}")  // Fix the URL mapping to be consistent with other mappings
    public ResponseEntity<SalaryBase> createSalaryDetails(@PathVariable Long employeeId, @RequestBody SalaryBase salaryDetails) {
        Optional<SalaryBase> existingSalaryDetails = salaryRepository.findByEmployeeEmployeeId(employeeId);

        // If salary details already exist, return a bad request
        if (existingSalaryDetails.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Or handle it as you want
        }

        // Get the employee by ID and set the employee in salary details
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        salaryDetails.setEmployee(employee);  // Set the employee details

        // Save the new salary details
        SalaryBase savedSalary = salaryRepository.save(salaryDetails);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedSalary);  // Return a successful response with status 201
    }
}
