package com.grandelite.payrollsystem.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Employee {
    @Id
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "short_name",nullable = false)
    private String shortName;

}
