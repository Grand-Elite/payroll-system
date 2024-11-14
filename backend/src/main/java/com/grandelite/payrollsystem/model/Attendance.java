package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Data
public class Attendance {
    @Id
    @Column(name = "attendance_record_id", nullable = false)
    private String attendanceRecordId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name="actual_end_time")
    private LocalDateTime actualEndTime;

    @Column(name="work_mins")
    private Long workMins;

    @Column(name= "ot_mins")
    private Long otMins;

    @Column(name= "ot_early_clockin_mins")
    private Long otEarlyClockinMins;

    @Column(name= "ot_late_clockout_mins")
    private Long otLateClockoutMins;

    @Column(name = "attendance")
    private String attendance;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;


    @ManyToOne
    @JoinColumn(name="shift_id")
    private Shift shift;

    @OneToOne
    @JoinColumn(name="attendance_record_id")
    private OverwrittenAttendanceStatus overwrittenAttendanceStatus;


}
