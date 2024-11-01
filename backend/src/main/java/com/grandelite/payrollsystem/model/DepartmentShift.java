
package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

public class DepartmentShift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="department_shift_recode_id")
    private Long departmentShiftRecodeId;


    @ManyToOne
    @JoinColumn(name="department_id", nullable = false, foreignKey = @ForeignKey(name="fk_department_shift_department"))
    private Department department;

    @ManyToOne
    @JoinColumn(name ="shift_id", nullable = false, foreignKey =@ForeignKey(name="fk_department_shift_shift"))
    private Shift shift;


}
