package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.*;
import com.grandelite.payrollsystem.repository.*;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.apache.poi.ss.usermodel.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;

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

    @Autowired
    MonthlySalaryUpdatesRepository monthlySalaryUpdatesRepository;

    @Override
    public MonthlyFullSalary getMonthlyFullSalary(Long employeeId, String year, String month) {
        return monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employeeId, year, month);
    }

    @Override
    public void calculateMonthlyFullSalary(Long employeeId, String year, int month) {
        String monthStr = Month.of(month).getDisplayName(TextStyle.FULL,Locale.ENGLISH);
        try {
            Employee employee = employeeRepository.getReferenceById(employeeId);
            MonthlyFullSalary mfs = new MonthlyFullSalary();
            SalaryBase salaryBase = salaryRepository.findByEmployeeEmployeeId(employeeId).orElseThrow();

            MonthlySalaryUpdates monthlySalaryUpdates = monthlySalaryUpdatesRepository.findByEmployee_EmployeeIdAndYearAndMonth(employeeId, year, monthStr).orElse(new MonthlySalaryUpdates());

            AttendanceSummary attendanceSummary = attendanceRepository.findAggregatedMonthlyAttendanceSummary(employeeId, year, month);
            System.out.println(employee.getShortName()+"::"+attendanceSummary);
            mfs.setMonthlyFullSalaryRecordId(employeeId+":" + year + ":"+month);
            mfs.setEmployee(employee);
            mfs.setYear(year);
            mfs.setMonth(monthStr);

            mfs.setBasic(salaryBase.getBasicSalary());

            mfs.setAttendanceAllowance(
                    Objects.requireNonNullElse(monthlySalaryUpdates.getAttendanceAllowance(),Double.valueOf(0))
                            *Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(),0d));

            mfs.setNoPayAmount(
                    Objects.requireNonNullElse(attendanceSummary.getNoPayDaysCount(),0l)
                            *(salaryBase.getBasicSalary()/30));

            mfs.setArrears(Objects.requireNonNullElse(monthlySalaryUpdates.getArrears(),Double.valueOf(0)));

            mfs.setTotalForEpf(salaryBase.getBasicSalary()-(mfs.getNoPayAmount()+mfs.getArrears()));

            mfs.setBonus(Objects.requireNonNullElse(monthlySalaryUpdates.getBonus(),Double.valueOf(0)));

            mfs.setOt1(
                    Objects.requireNonNullElse(attendanceSummary.getOt1HoursSum(),0d)
                            *60*((salaryBase.getBasicSalary()*
                    Objects.requireNonNullElse(salaryBase.getOt1Rate(),Double.valueOf(0)))/(30*8*60)));

            //todo fix this using two ot2 types
//            mfs.setOt2(attendanceSummary.getOt2HoursSum()*(salaryBase.getBasicSalary()/8*30)*1.5*3);   //This calculation only handles the Saturday OT amount. But the OT-2 for Poya day is calculated through a separated formula.
                                                                                // OT-2 for Poya Day = (Basic Salary)/(30*2)
            mfs.setOt2(0D);
            mfs.setGrossPay(mfs.getTotalForEpf()+mfs.getBonus()+mfs.getOt1()+mfs.getOt2());

            mfs.setTransportAllowance(
                    Objects.requireNonNullElse(monthlySalaryUpdates.getTransportAllowance(),Double.valueOf(0))
                            *Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(),0d));

            mfs.setPerformanceAllowance(Objects.requireNonNullElse(
                    monthlySalaryUpdates.getPerformanceAllowance(),Double.valueOf(0)));

            //todo fix this 26 days logic
            double incentives = (Objects.requireNonNullElse(
                    attendanceSummary.getAttendanceCount(),0d)-26) * (salaryBase.getBasicSalary() / 30);
            if (incentives <= 0) {
                incentives = Objects.requireNonNullElse(monthlySalaryUpdates.getIncentives(),Double.valueOf(0));
            }
            mfs.setIncentives(incentives);

            mfs.setTotalAllowance(mfs.getAttendanceAllowance()+mfs.getTransportAllowance()+mfs.getPerformanceAllowance()+mfs.getIncentives());

            mfs.setTotalMonthlySalary(mfs.getGrossPay() + mfs.getTotalAllowance());

            mfs.setEpfEmployeeAmount(mfs.getTotalForEpf()*0.08);

            mfs.setSalaryAdvance(
                    Objects.requireNonNullElse(monthlySalaryUpdates.getSalaryAdvance(),Double.valueOf(0)));

            mfs.setLateCharges(
                    Objects.requireNonNullElse(attendanceSummary.getLateHoursSum(),0d)*60*salaryBase.getLateChargesPerMin());

            mfs.setOtherDeductions(
                    Objects.requireNonNullElse(monthlySalaryUpdates.getOtherDeductions(),Double.valueOf(0)));

            mfs.setFoodBill(Objects.requireNonNullElse(monthlySalaryUpdates.getFoodBill(),Double.valueOf(0)));

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
