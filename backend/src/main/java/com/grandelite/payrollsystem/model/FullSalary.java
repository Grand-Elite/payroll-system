package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class FullSalary {

    @Id
    @Column(name="monthly_full_salary_record_id")
    private Long monthlyFullSalaryRecordId;

    @OneToOne
    @JoinColumn(name="employee_id")
    private Employee employee;

    @Column(name="year")
    private String year;

    @Column(name="month")
    private String month;

    @Column(name="basic")
    private Long basic;

    @Column(name="ot_1")
    private Long ot1;

    @Column(name="ot_2")
    private Long ot2;

    @Column(name="attendance_allowance")
    private Long attendanceAllowance;

    @Column(name="transport_allowance")
    private Long transportAllowance;

    @Column(name="performance_allowance")
    private Long performanceAllowance;

    @Column(name="total_monthly_salary")
    private Long totalMonthlySalary;

    @Column(name="epf_employee_amount")
    private Long epfEmployeeAmount;

    @Column(name="salary_advance")
    private Long salaryAdvance;

    @Column(name="net_salary")
    private Long netSalary;

}
