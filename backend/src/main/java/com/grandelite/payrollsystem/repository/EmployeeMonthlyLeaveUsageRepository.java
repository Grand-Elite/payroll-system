package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.EmployeeMonthlyLeaveUsage;
import com.grandelite.payrollsystem.model.EmployeeYearlyLeaveEligibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface EmployeeMonthlyLeaveUsageRepository extends JpaRepository<EmployeeMonthlyLeaveUsage, String> {

    @Query("SELECT e FROM EmployeeMonthlyLeaveUsage e WHERE e.employee.id = :employeeId AND e.year = :year AND e.month = :month")
    Optional<EmployeeMonthlyLeaveUsage> findByEmployeeIdAndYearAndMonth(@Param("employeeId") Long employeeId,
                                                                        @Param("year") String year,
                                                                        @Param("month") String month);

    @Query("SELECT e FROM EmployeeMonthlyLeaveUsage e WHERE e.employee.id = :employeeId AND e.year = :year")
    List<EmployeeMonthlyLeaveUsage> findAllByEmployeeIdAndYear(@Param("employeeId") Long employeeId,
                                                               @Param("year") String year);



        @Query("SELECT e FROM EmployeeMonthlyLeaveUsage e WHERE e.employee.id = :employeeId AND e.year = :year")
        List<EmployeeMonthlyLeaveUsage> findYearlyLeaveUsageByEmployeeIdAndYear(
                @Param("employeeId") Long employeeId,
                @Param("year") String year
        );
    }





