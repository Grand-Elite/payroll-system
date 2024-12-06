package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.MonthlySalaryUpdates;

import java.util.Optional;

public interface MonthlySalaryUpdatesService {
    MonthlySalaryUpdates createSalaryUpdate(Long employeeId, String year, String month,  MonthlySalaryUpdates salaryUpdate);

    Optional<MonthlySalaryUpdates> findByEmployee_EmployeeIdAndYearAndMonth(Long employeeId, String year, String month, MonthlySalaryUpdates salaryUpdate);

    Optional<MonthlySalaryUpdates> getMonthlySalaryUpdatesByEmployeeId(Long employeeId, String year, String month);

    Optional<MonthlySalaryUpdates> updateSalaryUpdateByEmployeeId(Long employeeId, String year, String month, MonthlySalaryUpdates salaryUpdate);
}
