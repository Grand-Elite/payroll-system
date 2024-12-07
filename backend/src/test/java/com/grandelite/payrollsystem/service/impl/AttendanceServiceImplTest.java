package com.grandelite.payrollsystem.service.impl;

import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class AttendanceServiceImplTest {

    @Test
    void shiftEndsDuringDayWithOt() {
        Duration d = new AttendanceServiceImpl().compansateDayChange(
                LocalTime.of(17,00),LocalTime.of(17,20)
        );
        assertEquals(20l,d.toMinutes());
    }

    @Test
    void shiftEndsDuringDayWithEarlyClockOut() {
        Duration d = new AttendanceServiceImpl().compansateDayChange(
                LocalTime.of(17,00),LocalTime.of(16,45)
        );
        assertEquals(-15l,d.toMinutes());
    }

    @Test
    void shiftEndsMidNightWithOt() {
        Duration d = new AttendanceServiceImpl().compansateDayChange(
                LocalTime.of(00,00),LocalTime.of(00,45)
        );
        assertEquals(45l,d.toMinutes());
    }

    @Test
    void shiftEndsMidNightWithEarlyClockOut() {
        Duration d = new AttendanceServiceImpl().compansateDayChange(
                LocalTime.of(00,00),LocalTime.of(23,45)
        );
        assertEquals(-15l,d.toMinutes());
    }

    @Test
    void shiftEndsDuringDayAndClockedOutNextDay() {
        Duration d = new AttendanceServiceImpl().compansateDayChange(
                LocalTime.of(23,45),LocalTime.of(00,15)
        );
        assertEquals(30l,d.toMinutes());
    }
}