package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.HolidayCalendar;
import com.grandelite.payrollsystem.repository.HolidayCalendarRepository;
import com.grandelite.payrollsystem.service.HolidayCalendarService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class HolidayCalendarServiceImpl implements HolidayCalendarService {

    @Autowired
    private HolidayCalendarRepository holidayCalendarRepository;

    // Save or update holiday
    @Override
    public void saveHoliday(HolidayCalendar holidayCalendar) {
        // Check if a holiday already exists for the given date
        HolidayCalendar existingHoliday = holidayCalendarRepository.findByHolidayDate(holidayCalendar.getHolidayDate());

        if (existingHoliday != null) {
            // If holiday exists, update its description
            existingHoliday.setDescription(holidayCalendar.getDescription());
            holidayCalendarRepository.save(existingHoliday);  // Update existing holiday
        } else {
            // If holiday doesn't exist, insert a new holiday
            holidayCalendarRepository.save(holidayCalendar);  // Insert new holiday
        }
    }

    // Get all holidays
    @Override
    public List<HolidayCalendar> getAllHolidays() {
        return holidayCalendarRepository.findAll();
    }
//
//    @Override
//    public void deleteHoliday(LocalDate holidayDate) {
//        holidayCalendarRepository.deleteByHolidayDate(holidayDate);
//    }

    @Override
    @Transactional
    public void deleteHoliday(LocalDate holidayDate) {
        // Log the date to verify it
        System.out.println("Deleting holiday for date: " + holidayDate);

        // Retrieve the holiday by date, check for null if not found
        HolidayCalendar holiday = holidayCalendarRepository.findByHolidayDate(holidayDate);
        if (holiday != null) {
            holidayCalendarRepository.delete(holiday);
            System.out.println("Holiday deleted: " + holidayDate);
        } else {
            System.err.println("Holiday not found: " + holidayDate);
            throw new IllegalArgumentException("Holiday not found");
        }
    }
}
