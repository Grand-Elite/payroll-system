package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class EmployeeYearlyLeaveEligibility {

    @Id
    @Column(name="leave_record_id", nullable = false)
    private String leaveRecordId;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name="annual")
    private Long annual;

    @Column(name="medical")
    private Long medical;

    @Column(name="casual")
    private Long casual;

    @Column(name="year", nullable = false)
    private String year;
}