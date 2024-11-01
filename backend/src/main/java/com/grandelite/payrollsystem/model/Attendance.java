package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
public class Attendance {
    @Id
    @Column(name = "attendance_record_id", nullable = false)
    private Long attendance_record_id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "actual_start_time")
    private LocalTime actualStartTime;

    @Column(name="actual_end_time")
    private LocalTime actualEndTime;

    @Column(name="work_hours")
    private Long workHours;

    @Column(name= "ot_hours")
    private Long otHours;

    @Column(name = "attendance")
    private String attendance;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;


    @ManyToOne
    @JoinColumn(name="shift_id")
    private Shift shift;


}
