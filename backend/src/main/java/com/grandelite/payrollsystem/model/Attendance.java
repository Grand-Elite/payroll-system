package com.grandelite.payrollsystem.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Attendance {
    @Id
    @Column(name = "attendance_record_id", nullable = false)
    private Long attendance_record_id;


}
