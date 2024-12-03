package com.grandelite.payrollsystem.service;


import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.repository.SalaryRepository;
import org.springframework.stereotype.Service;

@Service
public interface SalaryService {

    SalaryBase getSalaryDetailsByEmployeeId(Long employeeId);

    String updateSalaryDetails(Long employeeId, SalaryBase updatedSalaryDetails);

    SalaryBase createSalaryDetails(Long employeeId, SalaryBase salaryDetails);
}