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
public class SalaryBaseController {

    private final SalaryService salaryService;
    private final EmployeeRepository employeeRepository;
    private final SalaryRepository salaryRepository;

    // Constructor-based dependency injection
    @Autowired
    public SalaryBaseController(SalaryService salaryService,
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
        String responseMessage = salaryService.updateSalaryDetails(employeeId, updatedSalaryDetails);
        if ("Employee not found.".equals(responseMessage)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMessage);
        }
        return ResponseEntity.ok(responseMessage);
    }

    @PostMapping("/{employeeId}")
    public ResponseEntity<SalaryBase> createSalaryDetails(
            @PathVariable Long employeeId,
            @RequestBody SalaryBase salaryDetails
    ) {

        SalaryBase createdSalary = salaryService.createSalaryDetails(employeeId, salaryDetails);
        if (createdSalary == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Or handle differently
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSalary);
    }
}
