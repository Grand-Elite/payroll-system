package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.SalaryBase;
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

    @Autowired
    private SalaryRepository salaryRepository;


    public SalaryController(SalaryService salaryBaseService) {
        this.salaryService = salaryBaseService;
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
}