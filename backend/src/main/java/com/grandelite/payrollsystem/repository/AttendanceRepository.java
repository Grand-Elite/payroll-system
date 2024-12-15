
package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.model.AttendanceSummary;
import com.grandelite.payrollsystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,String> {
    @Query("SELECT a FROM Attendance a " +
            "WHERE a.employee.employeeId = :employeeId" +
            " AND EXTRACT(YEAR FROM a.date)=:year"  +
            " AND EXTRACT(MONTH FROM a.date)=:month")
    List<Attendance> findAttendanceByEmployeeId(
            @Param("employeeId") Long employeeId,
            @Param("year") String year,
            @Param("month") int month);


    @Modifying
    @Query(value = "INSERT INTO overwritten_attendance_status (attendance_record_id, updated_attendance_status, updated_lc_early_clockout_mins, updated_lc_late_clockin_mins, updated_ot_early_clockin_mins, updated_ot_late_clockout_mins, updated_total_lc_mins, updated_total_ot_mins) " +
            "VALUES (:attendanceRecordId, :status, :updatedLcEarlyClockoutMins, :updatedLcLateClockinMins, :updatedOtEarlyClockinMins, :updatedOtLateClockoutMins, :updatedTotalLcMins, :updatedTotalOtMins) " +
            "ON DUPLICATE KEY UPDATE updated_attendance_status = :status, " +
            "updated_lc_early_clockout_mins = :updatedLcEarlyClockoutMins, " +
            "updated_lc_late_clockin_mins = :updatedLcLateClockinMins, " +
            "updated_ot_early_clockin_mins = :updatedOtEarlyClockinMins, " +
            "updated_ot_late_clockout_mins = :updatedOtLateClockoutMins, " +
            "updated_total_lc_mins = :updatedTotalLcMins, " +
            "updated_total_ot_mins = :updatedTotalOtMins", nativeQuery = true)
    void updateOrInsertOverwrittenStatus(
            @Param("attendanceRecordId") String attendanceRecordId,
            @Param("status") String updatedAttendanceStatus,
            @Param("updatedLcEarlyClockoutMins") Long updatedLcEarlyClockoutMins,
            @Param("updatedLcLateClockinMins") Long updatedLcLateClockinMins,
            @Param("updatedOtEarlyClockinMins") Long updatedOtEarlyClockinMins,
            @Param("updatedOtLateClockoutMins") Long updatedOtLateClockoutMins,
            @Param("updatedTotalLcMins") Long updatedTotalLcMins,
            @Param("updatedTotalOtMins") Long updatedTotalOtMins
    );

    @Query(value = "SELECT " +
            "new com.grandelite.payrollsystem.model.AttendanceSummary(" +
            "SUM(CASE " +
            "   WHEN oas.updatedAttendanceStatus IS NOT NULL THEN " +
            "       CASE " +
            "           WHEN oas.updatedAttendanceStatus = '1' THEN 1.0" +
            "           WHEN oas.updatedAttendanceStatus = '0.5' THEN 0.5 " +
            "           ELSE 0.0 " +
            "       END " +
            "   ELSE " +
            "       CASE " +
            "           WHEN a.attendance = '1' THEN 1.0" +
            "           WHEN a.attendance = '0.5' THEN 0.5 " +
            "           ELSE 0.0 " +
            "       END " +
            "END) AS attendanceCount,"+
            "SUM(" +
            "    CASE " +
            "        WHEN FUNCTION('DAYOFWEEK', a.date) <> 7 AND hc.holidayDate IS NULL THEN " +
            "            CASE " +
            "                WHEN oas.updatedTotalOtMins IS NOT NULL THEN oas.updatedTotalOtMins " +
            "                ELSE a.otMins " +
            "            END " +
            "        ELSE 0.0 " +
            "    END" +
            ") / 60.0 AS ot1HoursSum," +
            "SUM(" +
            "    CASE " +
            "        WHEN FUNCTION('DAYOFWEEK', a.date) = 7 THEN " +
            "            CASE " +
            "                WHEN oas.updatedTotalOtMins IS NOT NULL AND oas.updatedTotalOtMins > 0 THEN 1.0 " +
            "                WHEN a.otMins > 0 THEN 1.0" +
            "                ELSE 0.0 " +
            "            END " +
            "        ELSE 0.0 " +
            "    END" +
            ") AS saturdayWorkedCount,"+
            "SUM(" +
            "    CASE " +
            "        WHEN hc.holidayDate IS NOT NULL AND hc.mandatory = true AND FUNCTION('DAYOFWEEK', a.date) = 7 THEN " +
            "            CASE " +
            "                WHEN oas.updatedTotalOtMins IS NOT NULL AND oas.updatedTotalOtMins > 0 THEN 1.0 " +
            "                WHEN a.otMins > 0 THEN 1.0" +
            "                ELSE 0.0 " +
            "            END " +
            "        ELSE 0.0 " +
            "    END" +
            ") AS poyaOnSaturdayWorkedCount,"+
            "SUM(CASE " +
            "   WHEN oas.updatedTotalLcMins IS NOT NULL " +
            "   THEN oas.updatedTotalLcMins " +
            "   ELSE a.lcMins " +
            "END) / 60.0 AS lateHoursSum, " +
            ") FROM" +
            " Attendance a" +
            " LEFT JOIN OverwrittenAttendanceStatus oas ON a.attendanceRecordId = oas.attendanceRecordId" +
            " LEFT JOIN HolidayCalendar hc ON a.date=hc.holidayDate "+
            " WHERE a.employee.employeeId = :employeeId" +
            " AND EXTRACT(YEAR FROM a.date)=:year" +
            " AND EXTRACT(MONTH FROM a.date)=:month")
    AttendanceSummary findAggregatedMonthlyAttendanceSummary(Long employeeId, String year, int month);
}
