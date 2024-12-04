package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;



@Entity
@Data
@Table(name = "holiday_calendar")
public class HolidayCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="holiday_id", nullable = false)
    private Long holidayId;

    @Column(name ="holiday_date", nullable = false)
    private LocalDate holidayDate;

    @Column(name="description")
    private String description;



}
