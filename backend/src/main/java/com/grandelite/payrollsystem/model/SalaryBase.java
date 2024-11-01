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

    @Column(name="basic", nullable = false)
    private Long basic;

    @Column(name="attendance_allowance")
    private Long attendanceAllowance;

    @Column(name="transport_allowance")
    private Long transportAllowance;

    @Column(name="performance_allowance_eligibility")
    private Boolean performanceAllowanceEligibility;

    @Column(name="performance_allowance")
    private Long performanceAllowance;

    @Column(name="ot_1_rate")
    private Long ot1Rate;

    @Column(name="ot_2_rate")
    private Long ot2Rate;

    @Column(name="ot1_per_min_salary")
    private Long ot1PerMinSalary;

    @Column(name="ot2_per_min_salary")
    private Long ot2PerMinSalary;

    @Column(name = "bonus")
    private Long bonus;


}
