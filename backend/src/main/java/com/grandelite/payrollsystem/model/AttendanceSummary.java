package com.grandelite.payrollsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AttendanceSummary {
    private Double attendanceCount;
    private Double ot1HoursSum;
    private Double saturdayWorkedCount;
    private Double poyaOnSaturdayWorkedCount;
    private Double lateHoursSum;

    // private Double ot2HoursSaturdaySum;
    //private Double ot2HoursHolidaysSum;
    //private Long noPayDaysCount;

}
