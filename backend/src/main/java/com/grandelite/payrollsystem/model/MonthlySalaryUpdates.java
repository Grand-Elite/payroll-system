package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "monthly_salary_updates")
public class MonthlySalaryUpdates {

    @Id
    @Column(name = "monthly_salary_updates_record_id", nullable = false)
    private String monthlySalaryUpdatesRecordId;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "year", nullable = false)
    private String year;

    @Column(name = "month", nullable = false)
    private String month;

    @Column(name = "bonus")
    private Double bonus;

    @Column(name = "attendance_allowance")
    private Double attendanceAllowance;

    @Column(name = "transport_allowance")
    private Double transportAllowance;

    @Column(name = "performance_allowance")
    private Double performanceAllowance;

    @Column(name = "incentives")
    private Double incentives;

    @Column(name = "salary_advance")
    private Double salaryAdvance;

    @Column(name = "food_bill")
    private Double foodBill;

    @Column(name = "arrears")
    private Double arrears;

    @Column(name = "other_deductions")
    private Double otherDeductions;
}
