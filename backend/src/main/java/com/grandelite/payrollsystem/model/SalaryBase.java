package com.grandelite.payrollsystem.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SalaryBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="salary_base_recode_id")
    private Long salaryBaseRecodeId;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name="basic_salary", nullable = false)
    private Long basicSalary;

    @Column(name="attendance_allowance")
    private Long attendanceAllowance;

    @Column(name="transport_allowance")
    private Long transportAllowance;

    @Column(name="performance_allowance")
    private Long performanceAllowance;

    @Column(name = "incentives")
    private Long incentives;

    @Column(name="salary_advance")
    private Long salaryAdvance;

    @Column(name="food_bill")
    private Long foodBill;

    @Column(name="arrears")
    private Long arrears;

    @Column(name = "other_deductions")
    private Long otherDeductions;

    @Column(name="ot_1_rate")
    private Double ot1Rate;

    @Column(name="ot_2_rate")
    private Double ot2Rate;

    @Column(name = "bonus")
    private Long bonus;


}
