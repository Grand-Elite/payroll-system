package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

public class OverwrittenAttendanceStatus {
    @Id
    @Column(name="attendance_record_id",nullable = false)
    private String attendanceRecordId;

    @Column(name="updated_attendance_status")
    private String updatedAttendanceStatus;

    @Column(name="updated_ot_early_clockin_mins")
    private Long  updatedOtEarlyClockinMins;

    @Column(name="updated_ot_late_clockout_mins")
    private Long updatedOtLateClockoutMins;

    @Column(name="updated_lc_late_clockin_mins")
    private Long updatedLcLateClockinMins;

    @Column(name="updated_lc_early_clockout_mins")
    private Long updatedLcEarlyClockoutMins;

    @Column(name="updated_total_lc_mins")
    private Long updatedTotalLcMins;

    @Column(name="updated_total_ot_mins")
    private Long updatedTotalOtMins;


}


