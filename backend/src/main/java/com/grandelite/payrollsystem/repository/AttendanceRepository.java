package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    @Query("SELECT a FROM Attendance a WHERE a.employee.employeeId = :employeeId")
    List<Attendance> findAttendanceByEmployeeId(@Param("employeeId") Long employeeId);
}
