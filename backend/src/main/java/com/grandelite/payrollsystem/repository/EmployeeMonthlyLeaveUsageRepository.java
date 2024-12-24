package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.EmployeeMonthlyLeaveUsage;
import com.grandelite.payrollsystem.model.EmployeeYearlyLeaveEligibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeMonthlyLeaveUsageRepository extends JpaRepository<EmployeeMonthlyLeaveUsage, String> {

//    @Query("SELECT e FROM EmployeeMonthlyLeaveUsage e WHERE e.employee.id = :employeeId AND e.year = :year")
//    Optional<EmployeeMonthlyLeaveUsage> findByEmployeeIdAndYear(@Param("employeeId") Long employeeId, @Param("year") String year);
}
