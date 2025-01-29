package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.MonthlyFullSalary;

import java.util.List;

public interface MonthlyFullSalaryService {
    MonthlyFullSalary getMonthlyFullSalary(Long employeeId,String year,String month);

    void calculateMonthlyFullSalary(Long employeeId,String year,int month);

    List<MonthlyFullSalary> getMonthlySalaryDetailsForAll(String year, String month);
}
