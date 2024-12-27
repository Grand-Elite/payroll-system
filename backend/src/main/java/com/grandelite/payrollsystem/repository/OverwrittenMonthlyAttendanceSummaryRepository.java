package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.EmployeeMonthlyLeaveUsage;
import com.grandelite.payrollsystem.model.OverwrittenMonthlyAttendanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OverwrittenMonthlyAttendanceSummaryRepository extends JpaRepository<OverwrittenMonthlyAttendanceSummary, String> {


    @Query("SELECT e FROM OverwrittenMonthlyAttendanceSummary e WHERE e.employee.id = :employeeId AND e.year = :year AND e.month = :month")
    Optional<OverwrittenMonthlyAttendanceSummary> findByEmployeeIdAndYearAndMonth(@Param("employeeId") Long employeeId,
                                                                        @Param("year") String year,
                                                                        @Param("month") String month);
}
