package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Employee {
    @Id
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "short_name",nullable = false)
    private String shortName;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
