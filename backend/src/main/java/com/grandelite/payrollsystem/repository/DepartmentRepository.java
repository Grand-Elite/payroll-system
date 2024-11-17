package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department,Long> {
    @Query("SELECT d FROM Department d WHERE d.systemName = :departmentName")
    Department findByDepartmentSystemName(String departmentName);
}
