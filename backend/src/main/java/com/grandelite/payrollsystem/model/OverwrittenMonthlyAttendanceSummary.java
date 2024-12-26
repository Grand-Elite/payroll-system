package com.grandelite.payrollsystem.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class OverwrittenMonthlyAttendanceSummary {
    @Id
    @Column(name="overwritten_monthly_attendance_record_id", nullable = false)
    private String overwrittenMonthlyAttendanceRecordId;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name="adjusted_late_time")
    private Long adjustedLateTime;

    @Column(name="adjusted_ot_hours")
    private Long adjustedOtHours;

    @Column(name="year", nullable = false)
    private String year;

    @Column(name="month", nullable = false)
    private String month;

}
