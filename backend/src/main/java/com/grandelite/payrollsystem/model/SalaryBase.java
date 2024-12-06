package com.grandelite.payrollsystem.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "salary_base")
public class SalaryBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="salary_base_recode_id")
    private Long salaryBaseRecodeId;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name="basic_salary", nullable = false)
    private Double basicSalary;

    @Column(name="ot_1_rate")
    private Double ot1Rate;

    @Column(name="ot_2_rate")
    private Double ot2Rate;


    @Column(name="late_charges_per_min")
    private Double lateChargesPerMin;

}
