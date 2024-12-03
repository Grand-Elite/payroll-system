package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.AttendanceSummary;
import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.repository.AttendanceRepository;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.MonthlyFullSalaryRepository;
import com.grandelite.payrollsystem.repository.SalaryRepository;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class MonthlyFullSalaryServiceImpl implements MonthlyFullSalaryService {

    @Autowired
    MonthlyFullSalaryRepository monthlyFullSalaryRepository;

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    SalaryRepository salaryRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Override
    public MonthlyFullSalary getMonthlyFullSalary(Long employeeId, String year, String month) {
        return monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employeeId, year, month);
    }

    @Override
    public void calculateMonthlyFullSalary(Long employeeId, String year, String month) {
        try {
            Employee employee = employeeRepository.getReferenceById(employeeId);
            MonthlyFullSalary mfs = new MonthlyFullSalary();
            SalaryBase salaryBase = salaryRepository.findByEmployeeEmployeeId(employeeId).orElseThrow();//todo handle the base not found scenario
            AttendanceSummary attendanceSummary = attendanceRepository.findAggregatedMonthlyAttendanceSummary(employeeId, year, month);
            mfs.setMonthlyFullSalaryRecordId(employeeId + year + month);
            mfs.setEmployee(employee);
            mfs.setYear(year);
            mfs.setMonth(month);
            //todo implement calculation logics
            mfs.setBasic(salaryBase.getBasicSalary());
            mfs.setAttendanceAllowance(salaryBase.getAttendanceAllowance()*attendanceSummary.getAttendanceCount());
            monthlyFullSalaryRepository.save(mfs);
        }catch (NoSuchElementException e){
            System.out.println("Skipping the salary calculation for employee: "+employeeId+ " due to missing base salary");
        }
    }
}
