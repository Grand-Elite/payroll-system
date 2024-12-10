package com.grandelite.payrollsystem.controller;
import com.grandelite.payrollsystem.model.HolidayCalendar;
import com.grandelite.payrollsystem.service.HolidayCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/holidays")
public class HolidayCalendarController {

    @Autowired
    private HolidayCalendarService holidayCalendarService;

    // Endpoint to get all holidays
    @GetMapping
    public List<HolidayCalendar> getAllHolidays() {
        return holidayCalendarService.getAllHolidays();
    }

    @PostMapping
    public ResponseEntity<?> saveHolidays(@RequestBody List<HolidayCalendar> holidayCalendars) {
        try {
            for (HolidayCalendar holiday : holidayCalendars) {
                System.out.println("Holiday Date: " + holiday.getHolidayDate());
                System.out.println("Mandatory: " + holiday.getMandatory()); // Log the mandatory value
                holidayCalendarService.saveHoliday(holiday);
            }
            return ResponseEntity.ok().body(Map.of("message", "Holidays have been saved!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error saving holidays", "details", e.getMessage()));
        }
    }

    @DeleteMapping("/{holidayDate}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable String holidayDate) {
        try {
            // Log the received date to verify it's correct
            System.out.println("Date received by backend: " + holidayDate);

            // Try parsing the date with proper format
            Instant instant = Instant.parse(holidayDate + "T00:00:00Z"); // Appending 'T00:00:00Z' for UTC format
            LocalDate date = instant.atZone(ZoneId.of("UTC")).toLocalDate(); // Convert to LocalDate

            // Log parsed date for confirmation
            System.out.println("Parsed date: " + date);

            // Call the service to delete the holiday
            holidayCalendarService.deleteHoliday(date);

            return ResponseEntity.noContent().build(); // Respond with 204 No Content if successful
        } catch (DateTimeParseException e) {
            // Log and return 400 Bad Request for parsing errors
            System.err.println("Error parsing date: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            // Log and return 500 Internal Server Error for other issues
            System.err.println("Error processing request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
