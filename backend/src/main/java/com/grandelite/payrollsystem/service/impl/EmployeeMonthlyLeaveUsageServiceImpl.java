package com.grandelite.payrollsystem.service.impl;
import com.grandelite.payrollsystem.model.EmployeeMonthlyLeaveUsage;
import com.grandelite.payrollsystem.repository.EmployeeMonthlyLeaveUsageRepository;
import com.grandelite.payrollsystem.service.EmployeeMonthlyLeaveUsageService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeMonthlyLeaveUsageServiceImpl implements EmployeeMonthlyLeaveUsageService {

    private final EmployeeMonthlyLeaveUsageRepository leaveUsageRepository;

    // Constructor injection for the repository
    public EmployeeMonthlyLeaveUsageServiceImpl(EmployeeMonthlyLeaveUsageRepository leaveUsageRepository) {
        this.leaveUsageRepository = leaveUsageRepository;
    }

    @Override
    public Map<String, Long> getYearlyLeaveUsage(Long employeeId, String year) {
        // Fetch the list of leave usages for the given employee and year
        List<EmployeeMonthlyLeaveUsage> leaveUsageList =
                leaveUsageRepository.findAllByEmployeeIdAndYear(employeeId, year);

        // Initialize the map to store the totals
        Map<String, Long> usageTotals = new HashMap<>();
        usageTotals.put("annual", 0L);
        usageTotals.put("casual", 0L);
        usageTotals.put("medical", 0L);

        // Calculate the totals
        for (EmployeeMonthlyLeaveUsage usage : leaveUsageList) {
            usageTotals.put("annual", usageTotals.get("annual") + usage.getAnnual());
            usageTotals.put("casual", usageTotals.get("casual") + usage.getCasual());
            usageTotals.put("medical", usageTotals.get("medical") + usage.getMedical());
        }

        return usageTotals;
    }
}
