package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Attendance;
import com.grandelite.payrollsystem.repository.AttendanceRepository;
import com.grandelite.payrollsystem.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public String processExcelFile(MultipartFile file) {
        //todo
        List<Attendance> attendanceList= new ArrayList<>();


        attendanceRepository.saveAll(attendanceList);
        return "Success";
    }
}
