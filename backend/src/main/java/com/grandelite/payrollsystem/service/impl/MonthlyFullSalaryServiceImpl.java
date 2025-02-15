package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.*;
import com.grandelite.payrollsystem.repository.*;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.util.*;

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
    
    @Autowired
    OverwrittenMonthlyAttendanceSummaryRepository overwrittenMonthlyAttendanceSummaryRepository;

    @Override
    public MonthlyFullSalary getMonthlyFullSalary(Long employeeId, String year, String month) {
        return monthlyFullSalaryRepository.findByEmployeeIdYearMonth(employeeId, year, month);
    }

    public List<MonthlyFullSalary> getMonthlySalaryDetailsForAll(String year, String month) {
        List<MonthlyFullSalary> salaryDetails = monthlyFullSalaryRepository.findByYearMonth(year, month);
        return salaryDetails;
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
            Optional<OverwrittenMonthlyAttendanceSummary> overwrittenMonthlyAttendanceSummary = overwrittenMonthlyAttendanceSummaryRepository.findByEmployeeIdAndYearAndMonth(employeeId, year, monthStr);

            System.out.println(employee.getShortName()+"::"+attendanceSummary);
            mfs.setMonthlyFullSalaryRecordId(employeeId+":" + year + ":"+month);
            mfs.setEmployee(employee);
            mfs.setYear(year);
            mfs.setMonth(monthStr);


            //Employee's Basic Salary (Just the Basic salary amount without any kind of calculation)
            mfs.setBasic(Objects.requireNonNullElse(salaryBase.getBasicSalary(), 0.0));

            //Employee's Attendance Allowance (Direct value without a
            mfs.setAttendanceAllowance(
                    Objects.requireNonNullElse(salaryBase.getAttendanceAllowance(),Double.valueOf(0))
                            *Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(),0d));


            Optional<EmployeeMonthlyLeaveUsage> employeeMonthlyLeaveUsage = employeeMonthlyLeaveUsageRepository.findByEmployeeIdAndYearAndMonth(employeeId, year, monthStr);

            //Calculation of NoPay deduction
            if (employeeMonthlyLeaveUsage.isPresent()) {
                EmployeeMonthlyLeaveUsage usage = employeeMonthlyLeaveUsage.get();
                mfs.setNoPayAmount(
                        Objects.requireNonNullElse(usage.getNoPayLeaves(), 0D)
                                * (salaryBase.getBasicSalary() / 30)
                );
            } else {
                // Handle the case where no data is found for the given employee, year, and month
                mfs.setNoPayAmount(0d);
            }

            //Arrears Calculation (Direct Value)
            mfs.setArrears(Objects.requireNonNullElse(monthlySalaryUpdates.getArrears(),Double.valueOf(0)));

            //Total For EPF (Total Salary Amount that is considered for 8% EPF Employee's Contribution)
            mfs.setTotalForEpf(
                    Objects.requireNonNullElse(salaryBase.getBasicSalary(), 0d) -  // Default to 0 if null
                            (Objects.requireNonNullElse(mfs.getNoPayAmount(), 0d) + Objects.requireNonNullElse(mfs.getArrears(), 0d))
            );


            //Bonus Calculation (Direct Value)
            mfs.setBonus(Objects.requireNonNullElse(monthlySalaryUpdates.getBonus(),Double.valueOf(0)));


            /*OT-1 Calculation for both Temporary and Permanent Employees based on their overtime each day. (No matter whether that day is a
             Saturday/Poy day or normal working day*/
            mfs.setOt1(
                    Objects.requireNonNullElse(
                            overwrittenMonthlyAttendanceSummary
                                    .map(OverwrittenMonthlyAttendanceSummary::getAdjustedOtHours)
                                    .orElse(0D),
                            0D
                    ) * 60 * (
                            (Objects.requireNonNullElse(salaryBase.getBasicSalary(), 0d) *
                                    Objects.requireNonNullElse(salaryBase.getOt1Rate(), 0d)) /
                                    (Objects.requireNonNullElse(salaryBase.getWorkingHours(), 1d) * 60)
                    )
            );


            // OT-2 for Saturday and Poya Day only for Permanent Employees
            if (!Objects.requireNonNullElse(employee.getEpfNo(), 0D).equals(0D)) { // Permanent Employee
                // Cap SaturdayWorkedCount at 4
                double saturdayWorkedCount = Math.min(
                        Objects.requireNonNullElse(attendanceSummary.getSaturdayWorkedCount(), 0D), 4);

                double poyaOnSaturdayWorkedCount = Objects.requireNonNullElse(
                        attendanceSummary.getPoyaOnSaturdayWorkedCount(), 0D);
                double poyaNotSaturdayWorkedCount = Objects.requireNonNullElse(
                        attendanceSummary.getPoyaNotSaturdayWorkedCount(), 0D);
                double basicSalary = Objects.requireNonNullElse(salaryBase.getBasicSalary(), 0D);
                double workingHours = Objects.requireNonNullElse(salaryBase.getWorkingHours(), 1D); // Avoid division by zero
                double ot2Rate = Objects.requireNonNullElse(salaryBase.getOt2Rate(), 1D);
                double saturdayOt2Amount =Objects.requireNonNullElse(saturdayWorkedCount * ((basicSalary * ot2Rate * 3) / workingHours), 1D);

                if (poyaOnSaturdayWorkedCount != 0D) {
                    // If the Poya day is a Saturday, then consider Poya Day OT formula for that day
                    mfs.setOt2((basicSalary / (30 * 2)) +
                            ((saturdayWorkedCount - 1) * ((basicSalary * ot2Rate * 3) / workingHours)));
                } else {
                    if (poyaNotSaturdayWorkedCount != 0D) { // To check whether the employee worked on Poya Day
                        // If the employee worked on the Poya day
                        mfs.setOt2((basicSalary / (30 * 2)) +
                                (saturdayOt2Amount));
                    } else { // If the employee did not work on the Poya day
                        mfs.setOt2((saturdayOt2Amount));
                    }
                }
            } else { // Temporary Employees
                double poyaNotSaturdayWorkedCount = Objects.requireNonNullElse(
                        attendanceSummary.getPoyaNotSaturdayWorkedCount(), 0D);
                double basicSalary = Objects.requireNonNullElse(salaryBase.getBasicSalary(), 0D);

                if (poyaNotSaturdayWorkedCount != 0D) {
                    // Only the Poya Day OT is applicable for the Temporary employees under the OT-2 Category
                    //mfs.setOt2((basicSalary / (30 * 2)));
                    mfs.setOt2(0D);
                } else {
                    // When the Temporary employee did not work on Poya day, they are not eligible for any OT-2 amount in that month.
                    mfs.setOt2(0D);
                }
            }


            //Gross Pay Calculation
            mfs.setGrossPay(mfs.getTotalForEpf()+mfs.getBonus()+mfs.getOt1()+mfs.getOt2());

            //Transport Allowance Calculation
            mfs.setTransportAllowance(
                    Objects.requireNonNullElse(salaryBase.getTransportAllowance(),Double.valueOf(0))
                            *Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(),0d));

            //Performance Allowance (Direct Amount)
            mfs.setPerformanceAllowance(Objects.requireNonNullElse(
                    salaryBase.getPerformanceAllowance(),Double.valueOf(0)));


            // Extract the month and year
            Month monthEnum = Month.valueOf(mfs.getMonth().toUpperCase());
            int selectedYear = Integer.parseInt(mfs.getYear());

            // Count non-mandatory public holidays for the specific month and year
            int nonMandatoryPublicHolidays = holidayCalendarRepository.countNonMandatoryHolidaysByYearAndMonth(selectedYear, monthEnum.getValue());


            // Incentives Calculations
            double attendanceCount = Objects.requireNonNullElse(attendanceSummary.getAttendanceCount(), 0d);
            int totalDaysInMonth = monthEnum.length(Year.isLeap(selectedYear));
            int nonWorkingDays = 4 + nonMandatoryPublicHolidays; // Sundays + non-mandatory public holidays
            double dailySalary = Objects.requireNonNullElse(salaryBase.getBasicSalary(), 0d) / 30;

            double incentives = (attendanceCount - (totalDaysInMonth - nonWorkingDays)) * dailySalary
                    + Objects.requireNonNullElse(monthlySalaryUpdates.getIncentives(), 0d);

            if (incentives <= 0) {
                incentives = Objects.requireNonNullElse(monthlySalaryUpdates.getIncentives(), 0d);
            }

            mfs.setIncentives(incentives);


            //Service Allowance (Direct Amount)
            mfs.setServiceAllowance(Objects.requireNonNullElse(
                    monthlySalaryUpdates.getServiceAllowance(),Double.valueOf(0)));


            //Total Allowance Calculation (Summation of the Attendance Allowance, Transport Allowance, Performance Allowance, and the other Incentives
            mfs.setTotalAllowance(
                    Objects.requireNonNullElse(mfs.getAttendanceAllowance(), 0d) +
                            Objects.requireNonNullElse(mfs.getTransportAllowance(), 0d) +
                            Objects.requireNonNullElse(mfs.getPerformanceAllowance(), 0d) +
                            Objects.requireNonNullElse(mfs.getIncentives(), 0d)+
                            Objects.requireNonNullElse(mfs.getServiceAllowance(),0d)
            );

            //Total Monthly Salary
            mfs.setTotalMonthlySalary(
                    Objects.requireNonNullElse(mfs.getGrossPay(), 0d) +
                            Objects.requireNonNullElse(mfs.getTotalAllowance(), 0d)
            );


            //EPF 8% Employee's Contribution (Only Applicable for the Permanent Employees (those who have an epf no)
            if (Objects.requireNonNullElse(employee.getEpfNo(), 0L) != 0L) {
                mfs.setEpfEmployeeAmount(Objects.requireNonNullElse(mfs.getTotalForEpf(), 0d) * 0.08);
            }

            //Salary Advance Deduction (Direct Value)
            mfs.setSalaryAdvance(
                    Objects.requireNonNullElse(monthlySalaryUpdates.getSalaryAdvance(),Double.valueOf(0)));

            //Late Charges Deduction Amount
            mfs.setLateCharges(
                    overwrittenMonthlyAttendanceSummary
                            .map(OverwrittenMonthlyAttendanceSummary::getAdjustedLateTime)
                            .orElse(0D) * 60 * salaryBase.getLateChargesPerMin()
            );

            //Other Deduction (Direct Value)
            mfs.setOtherDeductions(
                    Objects.requireNonNullElse(monthlySalaryUpdates.getOtherDeductions(),Double.valueOf(0)));

            //Food Bills (Direct Value)
            mfs.setFoodBill(Objects.requireNonNullElse(monthlySalaryUpdates.getFoodBill(),Double.valueOf(0)));

            //Total Deduction Calculation
            mfs.setTotalDeduction(
                    Objects.requireNonNullElse(mfs.getEpfEmployeeAmount(), 0d) +
                            Objects.requireNonNullElse(mfs.getSalaryAdvance(), 0d) +
                            Objects.requireNonNullElse(mfs.getLateCharges(), 0d) +
                            Objects.requireNonNullElse(mfs.getOtherDeductions(), 0d) +
                            Objects.requireNonNullElse(mfs.getFoodBill(), 0d)
            );


            //Net Salary Calculation After all the deductions
            mfs.setNetSalary(
                    Objects.requireNonNullElse(mfs.getTotalMonthlySalary(), 0d) -
                            Objects.requireNonNullElse(mfs.getTotalDeduction(), 0d)
            );


            //EPF 12% Company Contribution Calculation (Only Applicable for the Permanent Employees (those who have an epf no.)
            if (Objects.requireNonNullElse(employee.getEpfNo(), 0L) != 0L) {
                mfs.setEpfCompanyAmount(salaryBase.getBasicSalary() * 0.12);
            }


            //EPF Total Calculation from employee's salary (Only Applicable for the Permanent Employees (those who have an epf no.)
            if (Objects.requireNonNullElse(employee.getEpfNo(), 0L) != 0L) {
                mfs.setEpfTotal(mfs.getEpfEmployeeAmount() + mfs.getEpfCompanyAmount());
            }


            //ETF 3% Company Contribution Calculation (Only Applicable for the Permanent Employees (those who have an epf no.)
            if (Objects.requireNonNullElse(employee.getEpfNo(), 0L) != 0L) {
                mfs.setEtfCompanyAmount(salaryBase.getBasicSalary() * 0.03);
            }


            monthlyFullSalaryRepository.save(mfs);
        }catch (NoSuchElementException e){
            System.out.println("Skipping the salary calculation for employee: "+employeeId+ " due to missing base salary");
        }
    }
}
