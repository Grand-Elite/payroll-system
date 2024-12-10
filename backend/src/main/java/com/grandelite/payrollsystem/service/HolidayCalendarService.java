package com.grandelite.payrollsystem.service;
import com.grandelite.payrollsystem.model.HolidayCalendar;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface HolidayCalendarService {

    void saveHoliday(HolidayCalendar holidayCalendar);

    List<HolidayCalendar> getAllHolidays();


    void deleteHoliday(LocalDate holidayDate);



}
