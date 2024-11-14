package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.model.Department;
import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.OverwrittenAttendanceStatus;
import com.grandelite.payrollsystem.repository.AttendanceRepository;
import com.grandelite.payrollsystem.repository.DepartmentRepository;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.service.AttendanceService;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

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

//    public List<Attendance> overwriteAttendanceStatus(String attendance_record_id){
//        return attendanceRepository.
//
//    }


    @Override
    @Transactional
    public OverwrittenAttendanceStatus overwriteAttendanceStatus(OverwrittenAttendanceStatus overwrittenAttendanceStatus) {
        // Update or insert into the overwritten_attendance_status table using String for attendanceRecordId

        System.out.println(overwrittenAttendanceStatus);

        System.out.println(overwrittenAttendanceStatus.getUpdatedAttendanceStatus());
        System.out.println("Updating attendance record ID: " + overwrittenAttendanceStatus.getAttendanceRecordId() +
                " with status: " + overwrittenAttendanceStatus.getUpdatedAttendanceStatus());
        attendanceRepository.updateOrInsertOverwrittenStatus(
                overwrittenAttendanceStatus.getAttendanceRecordId(), // This is now a String
                overwrittenAttendanceStatus.getUpdatedAttendanceStatus()
        );

        return overwrittenAttendanceStatus;
    }

    private List<Attendance> extractClockInOutTimes(List<Map<String, String>> records) {
        // Parse records and group by Person ID and Adjusted Date
        Map<String, Map<LocalDate, List<LocalDateTime>>> groupedRecords = new HashMap<>();

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
        }

        // Process each group to find the clock-in and clock-out times
        List<Attendance> summaries = new ArrayList<>();
        for (String personName : groupedRecords.keySet()) {
            for (LocalDate date : groupedRecords.get(personName).keySet()) {
                List<LocalDateTime> times = groupedRecords.get(personName).get(date);
                times.sort(LocalDateTime::compareTo);

                LocalDateTime clockIn = times.stream().filter(t -> !t.toLocalTime().isBefore(DAY_CHANGE_TIME)).findFirst().orElse(null);
                LocalDateTime clockOut = times.stream().filter(t -> t.isBefore(LocalDateTime.of(date.plusDays(1), DAY_CHANGE_TIME)))
                        .reduce((first, second) -> second).orElse(null);

                if (clockIn != null && clockOut != null) {
                    Employee employee = employeeRepository.findByShortName(personName);
                    Department department = departmentRepository.findById(1l).orElseThrow(); //todo fix this
                    if(employee==null){
                        Long lastEmployeeId = employeeRepository.findLastEmployeeId();
                        employee = new Employee();
                        employee.setEmployeeId(lastEmployeeId==null?1l:lastEmployeeId+1l);
                        employee.setShortName(personName);
                        employee.setFullName(personName);
                        employee.setDepartment(department);
                        employee.setEmployeeType(Employee.EmployeeType.TEMPORARY);
                        employeeRepository.save(employee);
                    }
                    Attendance attendance = new Attendance();
                    attendance.setAttendanceRecordId(personName + date);
                    attendance.setEmployee(employee);
                    attendance.setDate(date);
                    attendance.setActualStartTime(clockIn);
                    attendance.setActualEndTime(clockOut);
                    attendance.setWorkHours(Duration.between(clockIn, clockOut).toHours());
                    attendance.setAttendance(calcAttendance(employee,clockIn,clockOut));
                    summaries.add(attendance);
                }
            }
        }
        return summaries;
    }

//    private String calcAttendance(Employee employee, LocalDateTime clockIn, LocalDateTime clockOut) {
//        // Calculate the work hours in minutes
//        long workMinutes = Duration.between(clockIn, clockOut).toMinutes();
//
//        // Determine the attendance status based on the workMinutes
//        if (workMinutes > 540) {
//            return "1"; // Full day
//        } else if (workMinutes >= 330) {
//            return "0.5"; // Half day
//        } else if (workMinutes == 0) {
//            return "ab"; // Absent
//        } else {
//            return "???"; // Incomplete or irregular attendance
//        }
//    }

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


