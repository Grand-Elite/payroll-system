package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.HolidayCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HolidayCalendarRepository extends JpaRepository<HolidayCalendar, Long> {

    // Find a holiday by its date
    HolidayCalendar findByHolidayDate(LocalDate holidayDate);

    void deleteByHolidayDate(LocalDate holidayDate);

}
