package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    @Query("SELECT u FROM Employee u WHERE u.shortName = :shortName")
    Employee findByShortName(@Param("shortName") String shortName);

    @Query("SELECT MAX(e.employeeId) FROM Employee e")
    Long findLastEmployeeId();
}
