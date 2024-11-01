package com.grandelite.payrollsystem.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Shift {
    @Id
    @Column(name = "shift_id", nullable = false)
    private Long shiftId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name="end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "employee_type", nullable = false)
    private String employeeType;

    @Column(name = "day_of_the_week", nullable = false)
    private String dayOfTheWeek;

    @Column(name = "no_of_hours", nullable = false)
    private long noOfHours;

    @Column(name ="ot_type", nullable = false)
    private String otType;

}
