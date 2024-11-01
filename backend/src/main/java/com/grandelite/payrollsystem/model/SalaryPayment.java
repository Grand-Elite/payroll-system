package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SalaryPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="salary_payment_recode_id")
    private Long salaryPaymentRecodeId;

    @OneToOne
    @JoinColumn(name="monthly_full_salary_record_id")
    private FullSalary fullSalary;

    @Column(name="paid")
    private Boolean paid;

    @Column(name="count_5000")
    private Long count5000;

    @Column(name="count_1000")
    private Long count1000;

    @Column(name="count_500")
    private Long count500;

    @Column(name="count_100")
    private Long count100;

    @Column(name="count_50")
    private Long count50;

    @Column(name="count_20")
    private Long count20;


}
