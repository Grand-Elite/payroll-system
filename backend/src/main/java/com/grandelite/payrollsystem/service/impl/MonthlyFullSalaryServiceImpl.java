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

            mfs.setNoPayAmount(attendanceSummary.getNoPayDaysCount()*(salaryBase.getBasicSalary()/30));

            mfs.setArrears(salaryBase.getArrears());

            mfs.setTotalForEpf(salaryBase.getBasicSalary()-(mfs.getNoPayAmount()+mfs.getArrears()));

            mfs.setBonus(salaryBase.getBonus());

            mfs.setOt1(attendanceSummary.getOt1HoursSum()*((salaryBase.getBasicSalary()*salaryBase.getOt1Rate())/30*8*60));

            mfs.setOt2((salaryBase.getBasicSalary()/8*30)*1.5*3);   //This calculation only handles the Saturday OT amount. But the OT-2 for Poya day is calculated through a separated formula.
                                                                                // OT-2 for Poya Day = (Basic Salary)/(30*2)

            mfs.setGrossPay(mfs.getTotalForEpf()+mfs.getBonus()+mfs.getOt1()+mfs.getOt2());

            mfs.setTransportAllowance(salaryBase.getTransportAllowance()*attendanceSummary.getAttendanceCount());

            mfs.setPerformanceAllowance(salaryBase.getPerformanceAllowance());

            mfs.setIncentives(attendanceSummary.getExtraWorkedDaysCount()*(salaryBase.getBasicSalary()/30));

            mfs.setTotalAllowance(mfs.getAttendanceAllowance()+mfs.getTransportAllowance()+mfs.getPerformanceAllowance());

            mfs.setTotalMonthlySalary(mfs.getGrossPay()+mfs.getTotalAllowance());

            mfs.setEpfEmployeeAmount(mfs.getTotalForEpf()*0.08);

            mfs.setSalaryAdvance(salaryBase.getSalaryAdvance());

            mfs.setLateCharges(attendanceSummary.getLateHoursSum()*salaryBase.getLateChargesPerMin());

            mfs.setOtherDeductions(salaryBase.getOtherDeductions());

            mfs.setFoodBill(salaryBase.getFoodBill());

            mfs.setTotalDeduction(mfs.getEpfEmployeeAmount()+mfs.getSalaryAdvance()+mfs.getLateCharges()+mfs.getOtherDeductions()+mfs.getFoodBill());

            mfs.setNetSalary(mfs.getTotalMonthlySalary()-mfs.getTotalDeduction());

            mfs.setEpfCompanyAmount(salaryBase.getBasicSalary()*0.12);

            mfs.setEpfTotal(mfs.getEpfEmployeeAmount()+ mfs.getEpfCompanyAmount());

            mfs.setEtfCompanyAmount(salaryBase.getBasicSalary()*0.03);

            monthlyFullSalaryRepository.save(mfs);
        }catch (NoSuchElementException e){
            System.out.println("Skipping the salary calculation for employee: "+employeeId+ " due to missing base salary");
        }
    }
}
