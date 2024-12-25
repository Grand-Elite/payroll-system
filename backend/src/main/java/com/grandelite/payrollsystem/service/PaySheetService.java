package com.grandelite.payrollsystem.service;

import java.io.ByteArrayOutputStream;

public interface PaySheetService {
    ByteArrayOutputStream getEmployeePaySheet(Long employeeId, String year, String month);

    ByteArrayOutputStream getAllPaySheets(String year, String month);
}
