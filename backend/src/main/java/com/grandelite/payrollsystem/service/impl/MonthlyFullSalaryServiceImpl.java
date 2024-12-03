package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.AttendanceSummary;
import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.repository.AttendanceRepository;
import com.grandelite.payrollsystem.repository.MonthlyFullSalaryRepository;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MonthlyFullSalaryServiceImpl implements MonthlyFullSalaryService {

    @Autowired
    MonthlyFullSalaryRepository monthlyFullSalaryRepository;

    @Autowired
    AttendanceRepository attendanceRepository;

    @Override
    public MonthlyFullSalary getMonthlyFullSalary(Long employeeId, String year, String month) {
        return monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employeeId, year, month);
    }

    @Override
    public void calculateMonthlyFullSalary(Long employeeId, String year, String month) {
        MonthlyFullSalary mfs = new MonthlyFullSalary();
        AttendanceSummary attendanceSummary = new AttendanceSummary(17L, (long) 15.2, (long) 2.5, (long) 3.2);
                //attendanceRepository.findAggregatedMonthlyAttendenceSummary(employeeId,year,month);
        //calculation logics

        monthlyFullSalaryRepository.save(mfs);
    }
}
