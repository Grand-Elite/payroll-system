package com.grandelite.payrollsystem.service;

import java.io.ByteArrayOutputStream;

public interface PaySheetService {
    ByteArrayOutputStream getPaySheet(Long employeeId, String year, String month);
}
