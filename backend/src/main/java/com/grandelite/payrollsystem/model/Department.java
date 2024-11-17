package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "system_name",nullable = false)
    private String systemName;
}
