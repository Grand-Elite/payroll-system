package com.grandelite.payrollsystem.repository;


import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.model.SalaryBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonthlyFullSalaryRepository extends JpaRepository<MonthlyFullSalary, String> {
    @Query("SELECT mfs FROM MonthlyFullSalary mfs WHERE mfs.employee.employeeId = :employeeId" +
            " AND mfs.year = :year" +
            " AND mfs.month = :month")
    MonthlyFullSalary findByEmployeeIdYearMonth(Long employeeId,int year,int month);
}