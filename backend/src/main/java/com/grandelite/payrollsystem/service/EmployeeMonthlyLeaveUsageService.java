package com.grandelite.payrollsystem.service;

import java.util.Map;

public interface EmployeeMonthlyLeaveUsageService {
    /**
     * Retrieves the yearly leave usage for a specific employee and year.
     *
     * @param employeeId The ID of the employee.
     * @param year       The year for which to retrieve leave usage.
     * @return A map containing the total leave usage categorized by type (e.g., annual, casual, medical).
     */
    Map<String, Long> getYearlyLeaveUsage(Long employeeId, String year);


}
