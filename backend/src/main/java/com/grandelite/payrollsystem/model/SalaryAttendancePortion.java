package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SalaryAttendancePortion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="salary_attendance_portion_recode_id")
    private Long salaryAttendancePortionRecodeId;

}
