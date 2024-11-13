package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShiftRepository extends JpaRepository<Shift,String> {

    @Query("SELECT s FROM Shift s WHERE s.department.id = :departmentId")
    List<Shift> findShiftByDepartmentId(@Param("departmentId") Long departmentId);

}
