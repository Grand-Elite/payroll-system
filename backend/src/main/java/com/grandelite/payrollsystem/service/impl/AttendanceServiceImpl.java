package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.*;
import com.grandelite.payrollsystem.repository.AttendanceRepository;
import com.grandelite.payrollsystem.repository.DepartmentRepository;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.ShiftRepository;
import com.grandelite.payrollsystem.service.AttendanceService;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MonthlyFullSalaryService monthlyFullSalaryService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    private final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final LocalTime DAY_CHANGE_TIME = LocalTime.of(3, 0);

    @Override
    public String processExcelFile(MultipartFile file) {
        List<Map<String,String>> parsedCsv = parseCsvFile(file);
        List<Attendance> attendanceList= extractClockInOutTimes(parsedCsv);
        attendanceRepository.saveAll(attendanceList);
        return "Success";
    }

    @Override
    public List<Attendance> findAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findAttendanceByEmployeeId(employeeId);
    }

    @Override
    @Transactional
    public OverwrittenAttendanceStatus overwriteAttendanceStatus(OverwrittenAttendanceStatus overwrittenAttendanceStatus) {
        // Update or insert into the overwritten_attendance_status table using String for attendanceRecordId

        System.out.println(overwrittenAttendanceStatus);

        System.out.println(overwrittenAttendanceStatus.getUpdatedAttendanceStatus());
        System.out.println("Updating attendance record with the following details:");
        System.out.printf(
                "Record ID: %s, Updated Status: %s, OT Late Clock-Out: %s, OT Early Clock-In: %s, LC Late Clock-In: %s, LC Early Clock-Out: %s%n",
                overwrittenAttendanceStatus.getAttendanceRecordId(),
                overwrittenAttendanceStatus.getUpdatedAttendanceStatus(),
                overwrittenAttendanceStatus.getUpdatedOtLateClockoutMins(),
                overwrittenAttendanceStatus.getUpdatedOtEarlyClockinMins(),
                overwrittenAttendanceStatus.getUpdatedLcLateClockinMins(),
                overwrittenAttendanceStatus.getUpdatedLcEarlyClockoutMins(),
                overwrittenAttendanceStatus.getUpdatedTotalLcMins(),
                overwrittenAttendanceStatus.getUpdatedTotalOtMins()
        );
        attendanceRepository.updateOrInsertOverwrittenStatus(
                overwrittenAttendanceStatus.getAttendanceRecordId(),
                overwrittenAttendanceStatus.getUpdatedAttendanceStatus(),
                overwrittenAttendanceStatus.getUpdatedLcEarlyClockoutMins(),
                overwrittenAttendanceStatus.getUpdatedLcLateClockinMins(),
                overwrittenAttendanceStatus.getUpdatedOtEarlyClockinMins(),
                overwrittenAttendanceStatus.getUpdatedOtLateClockoutMins(),
                overwrittenAttendanceStatus.getUpdatedTotalLcMins(),
                overwrittenAttendanceStatus.getUpdatedTotalOtMins()
        );

        //todo recalculate the monthly full salary here
        return overwrittenAttendanceStatus;
    }

    private List<Attendance> extractClockInOutTimes(List<Map<String, String>> records) {
        // Parse records and group by Person ID and Adjusted Date
        Map<String, Map<LocalDate, List<LocalDateTime>>> groupedRecords = new HashMap<>();
        Map<String, String> employeeDepartment = new HashMap<>();
        for (Map<String, String> record : records) {
            String personName = record.get("Name");
            LocalDateTime timestamp = LocalDateTime.parse(record.get("Time"), DATE_TIME_FORMATTER);

            // Adjust date to start the day at 3 AM
            LocalDate adjustedDate = timestamp.toLocalDate();
            if (timestamp.toLocalTime().isBefore(DAY_CHANGE_TIME)) {
                adjustedDate = adjustedDate.minusDays(1);
            }

            // Group by Person ID and adjusted date
            groupedRecords
                    .computeIfAbsent(personName, k -> new HashMap<>())
                    .computeIfAbsent(adjustedDate, k -> new ArrayList<>())
                    .add(timestamp);
            String departmentName = record.get("Department");
            employeeDepartment.put(personName,departmentName);
        }
        Map<String,Employee> employeeMap = new HashMap<>();
        // Process each group to find the clock-in and clock-out times
        List<Attendance> summaries = new ArrayList<>();
        for (String personName : groupedRecords.keySet()) {
            Employee employee = employeeMap.get(personName);
            for (LocalDate date : groupedRecords.get(personName).keySet()) {
                List<LocalDateTime> times = groupedRecords.get(personName).get(date);
                times.sort(LocalDateTime::compareTo);

                LocalDateTime clockIn = times.stream().filter(t -> !t.toLocalTime().isBefore(DAY_CHANGE_TIME)).findFirst().orElse(null);
                LocalDateTime clockOut = times.stream().filter(t -> t.isBefore(LocalDateTime.of(date.plusDays(1), DAY_CHANGE_TIME)))
                        .reduce((first, second) -> second).orElse(null);

                if (clockIn != null && clockOut != null) {
                    if (employee == null){
                        employee =employeeRepository.findByShortName(personName);
                        employeeMap.put(personName,employee);
                    }
                    if(employee==null){
                        employee = createEmployee(personName,employeeDepartment.get(personName));
                        employeeMap.put(personName,employee);
                    }
                    Attendance attendance = new Attendance();
                    attendance.setAttendanceRecordId(personName + date);
                    attendance.setEmployee(employee);
                    attendance.setDate(date);
                    attendance.setActualStartTime(clockIn);
                    attendance.setActualEndTime(clockOut);
                    attendance.setWorkMins(Duration.between(clockIn, clockOut).toMinutes());
                    attendance.setAttendance(calcAttendance(employee,clockIn,clockOut));
                    calcOtAndLateHours(employee,attendance);
                    summaries.add(attendance);
                }
            }
            //monthlyFullSalaryService.calculateMonthlyFullSalary(employee.getEmployeeId(),);
        }
        return summaries;
    }

//    private void calcOtAndLateHours(Employee employee, Attendance attendance) {
//        Map<Shift.ShiftPeriod,List<Shift>> shiftsMap =
//                shiftRepository.findShiftByDepartmentId(employee.getDepartment().getDepartmentId())
//                        .stream().collect(Collectors.groupingBy(Shift::getShiftPeriod));
//        //todo this is where the M/E overrriden status should be loaded.
//        // if overriden value is there, then directly use it instead of below logic
//        Shift userShift = shiftsMap.get(Shift.ShiftPeriod.MORNING).get(0);
//        if(attendance.getActualStartTime().toLocalTime().isAfter(LocalTime.of(12,00))
//            && shiftsMap.get(Shift.ShiftPeriod.EVENING) != null
//        ){
//            userShift = shiftsMap.get(Shift.ShiftPeriod.EVENING).get(0);
//        }
//
//        attendance.setShift(userShift);
//        long earlyClockInOtMins = Duration.between(attendance.getActualStartTime().toLocalTime(),userShift.getStartTime()).toMinutes();
//        long lateClockOutOtMins = compansateDayChange(userShift.getEndTime(),attendance.getActualEndTime().toLocalTime()).toMinutes();
//        long totalOtMins = 0L;
//
//
//        if(earlyClockInOtMins>0) {
//            attendance.setOtEarlyClockinMins(earlyClockInOtMins);
//            totalOtMins+=earlyClockInOtMins;
//        }else {
//            //todo late clockins
//        }
//        if(lateClockOutOtMins >0 ) {
//            attendance.setOtLateClockoutMins(lateClockOutOtMins);
//            totalOtMins+=lateClockOutOtMins;
//        }else {
//            //todo early clock outs
//        }
//
//        attendance.setOtMins(totalOtMins);
//
//    }


    private void calcOtAndLateHours(Employee employee, Attendance attendance) {
        Map<Shift.ShiftPeriod, List<Shift>> shiftsMap =
                shiftRepository.findShiftByDepartmentId(employee.getDepartment().getDepartmentId())
                        .stream().collect(Collectors.groupingBy(Shift::getShiftPeriod));

        // Determine the shift based on attendance time
        Shift userShift = shiftsMap.get(Shift.ShiftPeriod.MORNING).get(0);
        if (attendance.getActualStartTime().toLocalTime().isAfter(LocalTime.of(12, 0))
                && shiftsMap.get(Shift.ShiftPeriod.EVENING) != null) {
            userShift = shiftsMap.get(Shift.ShiftPeriod.EVENING).get(0);
        }

        attendance.setShift(userShift);

        // If no work minutes, set OT and LC to 0 and return early
        if (attendance.getWorkMins() == 0L) {
            attendance.setOtMins(0L);
            attendance.setLcMins(0L);
            return;
        }

        // Calculate OT and LC minutes
        long earlyClockInOtMins = Duration.between(attendance.getActualStartTime().toLocalTime(), userShift.getStartTime()).toMinutes();
        long lateClockOutOtMins = compansateDayChange(userShift.getEndTime(), attendance.getActualEndTime().toLocalTime()).toMinutes();
        long totalOtMins = 0L;
        long totalLcMins = 0L;

        // Handle early clock-in or late clock-in
        if (earlyClockInOtMins > 0) {
            attendance.setOtEarlyClockinMins(earlyClockInOtMins);
            totalOtMins += earlyClockInOtMins;
        } else {
            long lateClockInMins = Math.abs(earlyClockInOtMins); // Convert negative to positive
            attendance.setLcLateClockinMins(lateClockInMins);
            totalLcMins += lateClockInMins;
        }

        // Handle late clock-out or early clock-out
        if (lateClockOutOtMins > 0) {
            attendance.setOtLateClockoutMins(lateClockOutOtMins);
            totalOtMins += lateClockOutOtMins;
        } else {
            long earlyClockOutMins = Math.abs(lateClockOutOtMins); // Convert negative to positive
            attendance.setLcEarlyClockoutMins(earlyClockOutMins);
            totalLcMins += earlyClockOutMins;
        }

        // Set total OT and LC minutes
        attendance.setOtMins(totalOtMins);
        attendance.setLcMins(totalLcMins);
    }

    private Duration compansateDayChange(LocalTime shiftEndTime, LocalTime actualClockOutTime) {
        Duration duration = Duration.between(shiftEndTime,actualClockOutTime);
        if(actualClockOutTime.isAfter(LocalTime.of(00,00))
                && actualClockOutTime.isBefore(LocalTime.of(03,00))){
            //return duration.plusHours(24);
        }
        return duration;
    }


    private Employee createEmployee(String personName, String departmentName) {
        Department department = departmentRepository.findByDepartmentSystemName(departmentName);
        Long lastEmployeeId = employeeRepository.findLastEmployeeId();
        Employee employee = new Employee();
        employee.setEmployeeId(lastEmployeeId==null?1l:lastEmployeeId+1l);
        employee.setShortName(personName);
        employee.setFullName(personName);
        employee.setDepartment(department);
        employee.setEmployeeType(Employee.EmployeeType.TEMPORARY);
        employeeRepository.save(employee);
        return employee;
    }



    private String calcAttendance(Employee employee, LocalDateTime clockIn, LocalDateTime clockOut) {
        // Check if either clockIn or clockOut is null, indicating no record found
        if (clockIn == null || clockOut == null) {
            return "ab"; // Absent due to no record found
        }

        // Check if clockIn and clockOut are the same, indicating incomplete or irregular attendance
        if (clockIn.equals(clockOut)) {
            return "?"; // Incomplete or irregular attendance
        }

        // Calculate the work hours in minutes
        long workMinutes = Duration.between(clockIn, clockOut).toMinutes();

        // Determine the attendance status based on the workMinutes
        if (workMinutes > 540) {
            return "1"; // Full day
        } else if (workMinutes >= 330) {
            return "0.5"; // Half day
        } else {
            return "ab"; // Absent due to insufficient work hours
        }
    }


    public List<Map<String, String>> parseCsvFile(MultipartFile file) {
        List<Map<String, String>> dataList = new ArrayList<>();


        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine(); // Read and skip the header line
            String[] headers = headerLine.split(",");

            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                Map<String, String> dataMap = new HashMap<>();

                for (int i = 0; i < headers.length; i++) {
                    dataMap.put(headers[i], values.length > i ? values[i] : "");
                }
                dataList.add(dataMap);
            }
        }catch (IOException e){
            e.printStackTrace();
        }

        return dataList;
    }


}


