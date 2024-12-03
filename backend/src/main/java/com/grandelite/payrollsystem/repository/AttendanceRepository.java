
package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.model.AttendanceSummary;
import com.grandelite.payrollsystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    @Query("SELECT a FROM Attendance a WHERE a.employee.employeeId = :employeeId")
    List<Attendance> findAttendanceByEmployeeId(@Param("employeeId") Long employeeId);


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
            @Param("updatedLcEarlyClockoutMins") String updatedLcEarlyClockoutMins,
            @Param("updatedLcLateClockinMins") String updatedLcLateClockinMins,
            @Param("updatedOtEarlyClockinMins") String updatedOtEarlyClockinMins,
            @Param("updatedOtLateClockoutMins") String updatedOtLateClockoutMins,
            @Param("updatedTotalLcMins") String updatedTotalLcMins,
            @Param("updatedTotalOtMins") String updatedTotalOtMins
    );

    @Query(value = "SELECT new com.grandelite.payrollsystem.model.AttendanceSummary(COUNT(1),COUNT(1),COUNT(1),COUNT(1)) FROM" +
            " Attendance a" +
            //" LEFT JOIN overwritten_attendance_status oas ON a.attendance_record_id = oas.attendance_record_id" +
            " WHERE a.employee.employeeId = :employeeId" +
            " AND '2024'=:year" +
            " AND 'October'=:month")
    //todo fix this query
    AttendanceSummary findAggregatedMonthlyAttendanceSummary(Long employeeId, String year, String month);
}
