package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.service.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/salaryBase")
public class SalaryController {
    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryBaseService) {
        this.salaryService = salaryBaseService;
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<SalaryBase> getSalaryDetailsByEmployeeId(@PathVariable Long employeeId) {
        SalaryBase salaryDetails = salaryService.getSalaryDetailsByEmployeeId(employeeId);
        return ResponseEntity.ok(salaryDetails);
    }
}
