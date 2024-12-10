package com.grandelite.payrollsystem.repository;

import com.grandelite.payrollsystem.model.HolidayCalendar;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface HolidayCalendarRepository extends JpaRepository<HolidayCalendar, Long> {

    // Find a holiday by its date
    HolidayCalendar findByHolidayDate(LocalDate holidayDate);

    void deleteByHolidayDate(LocalDate holidayDate);

}
