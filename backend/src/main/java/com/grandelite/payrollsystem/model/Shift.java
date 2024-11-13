//package com.grandelite.payrollsystem.model;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Data
//@NoArgsConstructor
//public class Shift {
//
//    @Id
//    @Column(name = "shift_id", nullable = false)
//    private Long shiftId;
//
//    @Column(name="shift_type", nullable = false)
//    private String shiftType;
//
//    @Column(name = "start_time", nullable = false)
//    private String startTime;
//
//    @Column(name = "end_time", nullable = false)
//    private String endTime;
//
//    @ManyToOne
//    @JoinColumn(name = "department_id", nullable = false)
//    private Department department;
//
//    // Constructor with all fields
//    public Shift(Long shiftId,String shiftType, String startTime, String endTime, Department department) {
//        this.shiftId = shiftId;
//        this.shiftType = shiftType;
//        this.startTime = startTime;
//        this.endTime = endTime;
//        this.department = department;
//    }
//}


package com.grandelite.payrollsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Entity
@Data
@NoArgsConstructor
public class Shift {

    @Id
    @Column(name = "shift_id", nullable = false)
    private Long shiftId;

    @Column(name="shift_type", nullable = false)
    private String shiftType;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "end_time", nullable = false)
    private String endTime;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    // Enum for Shift Period
    public enum ShiftPeriod {
        MORNING,
        EVENING
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_period", nullable = false)
    private ShiftPeriod shiftPeriod;

    // Constructor with all fields
    public Shift(Long shiftId, String shiftType, String startTime, String endTime, Department department) {
        this.shiftId = shiftId;
        this.shiftType = shiftType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.department = department;
        this.shiftPeriod = determineShiftPeriod(startTime);
    }

    // Method to determine shift period based on start time
    private ShiftPeriod determineShiftPeriod(String startTime) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        try {
            LocalTime time = LocalTime.parse(startTime, timeFormatter);
            return (time.isBefore(LocalTime.NOON)) ? ShiftPeriod.MORNING : ShiftPeriod.EVENING;
        } catch (Exception e) {
            System.err.println("Error parsing startTime: " + startTime);
            e.printStackTrace();
            return ShiftPeriod.MORNING;  // Default to MORNING if parsing fails
        }
    }

    // Setter for startTime to automatically update shiftPeriod
    public void setStartTime(String startTime) {
        this.startTime = startTime;
        this.shiftPeriod = determineShiftPeriod(startTime);
    }
}
