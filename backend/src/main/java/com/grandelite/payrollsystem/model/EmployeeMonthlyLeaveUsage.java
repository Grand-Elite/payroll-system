package com.grandelite.payrollsystem.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class EmployeeMonthlyLeaveUsage {
    @Id
    @Column(name="leave_usage_id", nullable = false)
    private String leaveUsageId;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name="annual_leaves")
    private Long annualLeaves;

    @Column(name="medical")
    private Long medical;

    @Column(name="casual")
    private Long casual;

    @Column(name="ab_on_public_holiday")
    private Long abOnPublicHoliday;

    @Column(name="other")
    private Long other;

    @Column(name="no_pay_leaves")
    private Long noPayLeaves;

    @Column(name="monthly_mandatory_leaves")
    private Long monthlyMandatoryLeaves;

    @Column(name="year", nullable = false)
    private String year;

    @Column(name="month", nullable = false)
    private String month;

}