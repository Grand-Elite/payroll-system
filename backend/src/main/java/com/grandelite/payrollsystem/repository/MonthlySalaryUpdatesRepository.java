package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.MonthlySalaryUpdates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonthlySalaryUpdatesRepository extends JpaRepository<MonthlySalaryUpdates, Long> {

    @Query("SELECT m FROM MonthlySalaryUpdates m WHERE m.employee.id = :employeeId AND m.year = :year AND m.month = :month")
    Optional<MonthlySalaryUpdates> findByEmployee_EmployeeIdAndYearAndMonth(
            @Param("employeeId") Long employeeId,
            @Param("year") String year,
            @Param("month") String month);



}
