package com.grandelite.payrollsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AttendanceSummary {
    private Long attendanceCount;
    private Long ot1HoursSum;
    private Long ot2HoursSum;
    private Long lateHoursSum;
}
