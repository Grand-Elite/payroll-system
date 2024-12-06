package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.MonthlySalaryUpdates;
import com.grandelite.payrollsystem.service.MonthlySalaryUpdatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/monthly-salary-updates")
public class MonthlySalaryUpdatesController {

    @Autowired
    private MonthlySalaryUpdatesService monthlySalaryUpdatesService;

    @PostMapping("/{employeeId}/{year}/{month}")
    public ResponseEntity<MonthlySalaryUpdates> createSalaryUpdate(
            @PathVariable Long employeeId,
            @PathVariable String year,
            @PathVariable String month,
            @RequestBody MonthlySalaryUpdates salaryUpdate)
    {
        MonthlySalaryUpdates createdUpdate = monthlySalaryUpdatesService.createSalaryUpdate(employeeId,year, month,salaryUpdate);
        if(createdUpdate == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUpdate);
    }

    @PatchMapping("/{employeeId}/{year}/{month}")
    public ResponseEntity<MonthlySalaryUpdates> updateSalaryUpdate(
            @PathVariable Long employeeId,
            @PathVariable String year,
            @PathVariable String month,
            @RequestBody MonthlySalaryUpdates salaryUpdate) {
        System.out.println("Received employeeId: " + employeeId + ", year: " + year + ", month: " + month);
        return monthlySalaryUpdatesService.updateSalaryUpdateByEmployeeId(employeeId, year, month, salaryUpdate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{employeeId}/{year}/{month}")
    public ResponseEntity<Optional<MonthlySalaryUpdates>> getMonthlySalaryUpdatesByEmployeeId(
            @PathVariable Long employeeId,
            @PathVariable String year,
            @PathVariable String month){
        Optional<MonthlySalaryUpdates> monthlySalaryUpdates = monthlySalaryUpdatesService.getMonthlySalaryUpdatesByEmployeeId(employeeId,year,month);
        return ResponseEntity.ok(monthlySalaryUpdates);
    }

}
