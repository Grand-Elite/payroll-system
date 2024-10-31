package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> findAll();

    Employee findById(Long id);

    Employee save(Employee employee);
}
