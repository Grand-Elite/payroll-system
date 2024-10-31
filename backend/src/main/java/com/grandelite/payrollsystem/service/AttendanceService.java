package com.grandelite.payrollsystem.service;

import org.springframework.web.multipart.MultipartFile;

public interface AttendanceService {
    public String processExcelFile(MultipartFile file);
}
