package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "monthly_full_salary")
public class MonthlyFullSalary {

    @Id
    @Column(name="monthly_full_salary_record_id", nullable = false)
    private String monthlyFullSalaryRecordId;

    @OneToOne
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

}
