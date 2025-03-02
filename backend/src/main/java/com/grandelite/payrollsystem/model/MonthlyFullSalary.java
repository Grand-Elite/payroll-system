package com.grandelite.payrollsystem.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CollectionId;

import java.util.List;
import java.util.Map;


@Entity
@Data
@Table(name = "monthly_full_salary")
public class MonthlyFullSalary {

    @Id
    @Column(name="monthly_full_salary_record_id", nullable = false)
    private String monthlyFullSalaryRecordId;

    @ManyToOne
    @JoinColumn(name="employee_id",nullable = false)

    private Employee employee;

    @Column(name="year",nullable = false)
    private String year;

    @Column(name="month",nullable = false)
    private String month;

    @Column(name="basic")
    private Double basic;

    @Column(name="ot_1")
    private Double ot1;

    @Column(name="ot_2")
    private Double ot2;

    @Column(name="attendance_allowance")
    private Double attendanceAllowance;

    @Column(name="transport_allowance")
    private Double transportAllowance;

    @Column(name="performance_allowance")
    private Double performanceAllowance;

    @Column(name="total_monthly_salary")
    private Double totalMonthlySalary;

    @Column(name="epf_employee_amount")
    private Double epfEmployeeAmount;

    @Column(name="salary_advance")
    private Double salaryAdvance;

    @Column(name="net_salary")
    private Double netSalary;

    @Column(name ="food_bill")
    private Double foodBill;

    @Column(name="no_pay_amount")
    private Double noPayAmount;

    @Column(name="arrears")
    private Double arrears;

    @Column(name="total_for_epf")
    private Double totalForEpf;

    @Column(name="bonus")
    private Double bonus;

    @Column(name="gross_pay")
    private Double grossPay;

    @Column(name="incentives")
    private Double incentives;

    @Column(name="month_encouragement_allowance")
    private  Double monthEncouragementAllowance;

    @Column(name="total_allowance")
    private Double totalAllowance;

    @Column(name="late_charges")
    private Double lateCharges;

    @Column(name="other_deductions")
    private Double otherDeductions;

    @Column(name="total_deduction")
    private  Double totalDeduction;

    @Column(name="epf_company_amount")
    private Double epfCompanyAmount;

    @Column(name= "epf_total")
    private Double epfTotal;

    @Column(name="etf_company_amount")
    private Double etfCompanyAmount;

}
