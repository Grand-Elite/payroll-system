package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.OverwrittenMonthlyAttendanceSummary;
import org.springframework.http.ResponseEntity;

public interface OverwrittenMonthlyAttendanceSummaryService {
    ResponseEntity<String> saveAdjustedAttendanceSummary(
            String employeeId, String year, String month, Long adjustedLateTime, Long adjustedOtHours);

    ResponseEntity<Object> getAdjustedAttendanceSummary(Long employeeId, String year, String month);
}
