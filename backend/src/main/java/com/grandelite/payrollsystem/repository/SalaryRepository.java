package com.grandelite.payrollsystem.repository;


import com.grandelite.payrollsystem.model.SalaryBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<SalaryBase, Long> {
    Optional<SalaryBase> findByEmployeeEmployeeId(Long employeeId);
}
