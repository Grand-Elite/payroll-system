package com.grandelite.payrollsystem.service;


import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.repository.SalaryRepository;
import org.springframework.stereotype.Service;

@Service
public interface SalaryService {

    public SalaryBase getSalaryDetailsByEmployeeId(Long employeeId);
}