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

    @Column(name = "attendance_allowance")
    private Double attendanceAllowance;

    @Column(name = "transport_allowance")
    private Double transportAllowance;

    @Column(name = "performance_allowance")
    private Double performanceAllowance;

    @Column(name="ot_1_rate")
    private Double ot1Rate;

    @Column(name="ot_2_rate")
    private Double ot2Rate;

    @Column(name="late_charges_per_min")
    private Double lateChargesPerMin;

    @Column(name="working_hours")
    private Double workingHours;

    @Column(name="compulsory_ot_1_hours_per_day")
    private Double compulsoryOt1HoursPerDay;

    @Column(name="compulsory_ot_1_amount_per_day")
    private  Double compulsoryOt1AmountPerDay;

    @Column(name="monthly_total")
    private Double monthlyTotal;

    @Column(name= "ot_1_per_hour")
    private Double ot1PerHour;

    @Column(name="ot_2_sat_full_day")
    private Double ot2SatFullDay;
}
