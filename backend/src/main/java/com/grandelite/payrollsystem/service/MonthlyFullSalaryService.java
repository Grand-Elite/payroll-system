package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.MonthlyFullSalary;

public interface MonthlyFullSalaryService {
    MonthlyFullSalary getMonthlyFullSalary(Long employeeId,String year,String month);
}
