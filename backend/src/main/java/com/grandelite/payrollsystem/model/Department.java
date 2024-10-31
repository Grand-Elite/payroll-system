package com.grandelite.payrollsystem.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Department {
    @Id
    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "name",nullable = false)
    private String name;
}
