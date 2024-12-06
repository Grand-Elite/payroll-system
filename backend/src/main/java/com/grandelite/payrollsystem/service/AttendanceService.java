package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.model.OverwrittenAttendanceStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttendanceService {
    String processExcelFile(MultipartFile file);
    List<Attendance> findAttendanceByEmployeeId(Long employeeId,String year,String month);

    OverwrittenAttendanceStatus overwriteAttendanceStatus(OverwrittenAttendanceStatus overwrittenAttendanceStatus);




}
