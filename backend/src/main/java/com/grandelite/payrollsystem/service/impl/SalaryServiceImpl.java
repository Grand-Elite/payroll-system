package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.repository.SalaryRepository;
import com.grandelite.payrollsystem.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SalaryServiceImpl implements SalaryService {

    private final SalaryRepository salaryRepository;

    @Autowired
    public SalaryServiceImpl(SalaryRepository salaryRepository) {
        this.salaryRepository = salaryRepository;
    }

    /*
    @Override
    public SalaryBase getSalaryDetailsByEmployeeId(Long employeeId) {
        // Use orElseGet to return default salary if not found
        return salaryRepository.findByEmployeeEmployeeId(employeeId)
                .orElseGet(this::createDefaultSalaryBase);  // Using orElseGet to provide the default object
    }

     */

    @Override
    public SalaryBase getSalaryDetailsByEmployeeId(Long employeeId) {
        // Use orElseGet to return default salary if not found
        return salaryRepository.findByEmployeeEmployeeId(employeeId)
                .orElseGet(() -> {
                    SalaryBase defaultSalaryBase = createDefaultSalaryBase();
                    defaultSalaryBase.setBasicSalary(0.0); // indicate no record found
                    return defaultSalaryBase;
                });
    }


    // Method to create a default SalaryBase object with 0 values
    private SalaryBase createDefaultSalaryBase() {
        SalaryBase defaultSalaryBase = new SalaryBase();
        defaultSalaryBase.setBasicSalary(0.0);
        defaultSalaryBase.setAttendanceAllowance(0.0);
        defaultSalaryBase.setTransportAllowance(0.0);
        defaultSalaryBase.setPerformanceAllowance(0.0);
        defaultSalaryBase.setOt1Rate(0.0);  // Setting default value as 0.0 for Double fields
        defaultSalaryBase.setOt2Rate(0.0);  // Same for ot2Rate
        defaultSalaryBase.setIncentives(0.0);
        defaultSalaryBase.setSalaryAdvance(0.0);
        defaultSalaryBase.setFoodBill(0.0);
        defaultSalaryBase.setArrears(0.0);
        defaultSalaryBase.setOtherDeductions(0.0);
        defaultSalaryBase.setBonus(0.0);
        return defaultSalaryBase;
    }
}