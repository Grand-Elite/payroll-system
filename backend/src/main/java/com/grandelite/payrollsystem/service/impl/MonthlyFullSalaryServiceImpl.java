package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.*;
import com.grandelite.payrollsystem.repository.*;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

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

    @Autowired
    HolidayCalendarRepository holidayCalendarRepository;

    @Autowired
    EmployeeMonthlyLeaveUsageRepository employeeMonthlyLeaveUsageRepository;

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
                    Objects.requireNonNullElse(salaryBase.getAttendanceAllowance(),Double.valueOf(0))
                            *Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(),0d));

            Optional<EmployeeMonthlyLeaveUsage> employeeMonthlyLeaveUsage = employeeMonthlyLeaveUsageRepository.findByEmployeeIdAndYearAndMonth(employeeId, year, monthStr);

            if (employeeMonthlyLeaveUsage.isPresent()) {
                EmployeeMonthlyLeaveUsage usage = employeeMonthlyLeaveUsage.get();
                mfs.setNoPayAmount(
                        Objects.requireNonNullElse(usage.getNoPayLeaves(), 0L)
                                * (salaryBase.getBasicSalary() / 30)
                );
            } else {
                // Handle the case where no data is found for the given employee, year, and month
                mfs.setNoPayAmount(0d);
            }


            mfs.setArrears(Objects.requireNonNullElse(monthlySalaryUpdates.getArrears(),Double.valueOf(0)));

            mfs.setTotalForEpf(salaryBase.getBasicSalary()-(
                    Objects.requireNonNullElse(mfs.getNoPayAmount(),0d)
                            +Objects.requireNonNullElse(mfs.getArrears(),0d)));

            mfs.setBonus(Objects.requireNonNullElse(monthlySalaryUpdates.getBonus(),Double.valueOf(0)));

            mfs.setOt1(
                    Objects.requireNonNullElse(attendanceSummary.getOt1HoursSum(),0d)
                            *60*((salaryBase.getBasicSalary()*
                    Objects.requireNonNullElse(salaryBase.getOt1Rate(),Double.valueOf(0)))/(salaryBase.getWorkingHours()*60)));



            // OT-2 for Saturday and Poya Day only for Permanent Employees
                        if (employee.getEpfNo() != null && employee.getEpfNo() != 0L) {
                            if (attendanceSummary.getPoyaOnSaturdayWorkedCount() != 0L) {
                                mfs.setOt2((salaryBase.getBasicSalary() / (30 * 2)) +
                                        (3 * ((salaryBase.getBasicSalary() * 1.5 * 3) / (30 * salaryBase.getWorkingHours()))));
                            } else {
                                mfs.setOt2((salaryBase.getBasicSalary() / (30 * 2)) +
                                        (4 * ((salaryBase.getBasicSalary() * 1.5 * 3) / (30 * salaryBase.getWorkingHours()))));
                            }
                        } else {
                            mfs.setOt2(0D);
                        }


            mfs.setGrossPay(mfs.getTotalForEpf()+mfs.getBonus()+mfs.getOt1()+mfs.getOt2());

            mfs.setTransportAllowance(
                    Objects.requireNonNullElse(salaryBase.getTransportAllowance(),Double.valueOf(0))
                            *Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(),0d));

            mfs.setPerformanceAllowance(Objects.requireNonNullElse(
                    salaryBase.getPerformanceAllowance(),Double.valueOf(0)));


            // Extract the month and year
            Month monthEnum = Month.valueOf(mfs.getMonth().toUpperCase());
            int selectedYear = Integer.parseInt(mfs.getYear());

            // Count non-mandatory public holidays for the specific month and year
            int nonMandatoryPublicHolidays = holidayCalendarRepository.countNonMandatoryHolidaysByYearAndMonth(selectedYear, monthEnum.getValue());

            // Calculate incentives
            double attendanceCount = Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(), 0d);
            int totalDaysInMonth = monthEnum.length(Year.isLeap(selectedYear));
            int nonWorkingDays = 4 + nonMandatoryPublicHolidays; // Sundays + non-mandatory public holidays
            double dailySalary = salaryBase.getBasicSalary() / 30;

            double incentives = (attendanceCount - (totalDaysInMonth - nonWorkingDays)) * dailySalary
                    + Objects.requireNonNullElse(monthlySalaryUpdates.getIncentives(), 0d);

            if (incentives <= 0) {
                incentives = Objects.requireNonNullElse(monthlySalaryUpdates.getIncentives(), 0d);
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
