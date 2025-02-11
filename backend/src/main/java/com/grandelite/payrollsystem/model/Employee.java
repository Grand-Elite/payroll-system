package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(uniqueConstraints={@UniqueConstraint(columnNames={"short_name"})})
public class Employee {
    @Id
    // @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "short_name",nullable = false)
    private String shortName;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "nic_no")
    private String nicNo;

    public enum Status {
        ACTIVE,
        INACTIVE
    }

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;     //set the default employee's status as ACTIVE

    public enum EmployeeType {
        TEMPORARY,
        PERMANENT
    }

    @Column(name = "employee_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private EmployeeType employeeType;

    @Column(name = "designation")
    private String designation;

    @Column(name = "epf_no")
    private Long epfNo;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "Note")
    private String note;
}
