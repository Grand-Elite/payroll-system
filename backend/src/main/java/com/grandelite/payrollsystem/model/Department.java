package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor

public class Department {
    @Id
    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "name",nullable = false)
    private String name;


    // Parameterized constructor
    public Department(Long departmentId, String name) {
        this.departmentId = departmentId;
        this.name = name;
    }
}
