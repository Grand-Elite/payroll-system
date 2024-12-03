package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.repository.MonthlyFullSalaryRepository;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MonthlyFullSalaryServiceImpl implements MonthlyFullSalaryService {

    @Autowired
    MonthlyFullSalaryRepository monthlyFullSalaryRepository;

    @Override
    public MonthlyFullSalary getMonthlyFullSalary(Long employeeId, String year, String month) {
        return monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employeeId, year, month);
    }
}
