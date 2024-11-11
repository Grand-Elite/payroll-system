package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Shift {

    @Id
    @Column(name = "shift_id", nullable = false)
    private Long shiftId;

    @Column(name="shift_type", nullable = false)
    private String shiftType;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "end_time", nullable = false)
    private String endTime;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    // Constructor with all fields
    public Shift(Long shiftId,String shiftType, String startTime, String endTime, Department department) {
        this.shiftId = shiftId;
        this.shiftType = shiftType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.department = department;
    }
}
