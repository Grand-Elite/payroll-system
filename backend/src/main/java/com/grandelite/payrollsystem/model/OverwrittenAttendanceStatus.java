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

}


