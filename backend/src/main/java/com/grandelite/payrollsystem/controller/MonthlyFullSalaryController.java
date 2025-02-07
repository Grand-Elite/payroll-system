package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MonthlyFullSalaryController {
    @Autowired
    private MonthlyFullSalaryService monthlyFullSalaryService;

    @GetMapping("/employee/{employeeId}/monthly-full-salary/year/{year}/month/{month}")
    public ResponseEntity<MonthlyFullSalary> getMonthlyFullSalaryByEmployeeId
            (@PathVariable Long employeeId,
             @PathVariable String year,
             @PathVariable String month) {
        MonthlyFullSalary monthlyFullSalary = monthlyFullSalaryService.getMonthlyFullSalary(employeeId,year,month);
        return ResponseEntity.ok(monthlyFullSalary);
    }

    @GetMapping("/monthly-full-salary/year/{year}/month/{month}")
    public ResponseEntity<List<MonthlyFullSalary>> getMonthlySalaryDetailsForAll(
            @PathVariable String year, @PathVariable String month) {
        List<MonthlyFullSalary> salaryDetails = monthlyFullSalaryService.getMonthlySalaryDetailsForAll(year, month);
        return ResponseEntity.ok(salaryDetails);
    }




}
