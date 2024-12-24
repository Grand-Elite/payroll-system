package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.EmployeeYearlyLeaveEligibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeYearlyLeaveEligibilityRepository extends JpaRepository<EmployeeYearlyLeaveEligibility, String> {

    @Query("SELECT e FROM EmployeeYearlyLeaveEligibility e WHERE e.employee.id = :employeeId AND e.year = :year")
    Optional<EmployeeYearlyLeaveEligibility> findByEmployeeIdAndYear(@Param("employeeId") Long employeeId, @Param("year") String year);
}
