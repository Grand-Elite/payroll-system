package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface EmployeeService {
    List<Employee> findAll();

    Employee findById(Long id);

    Employee save(Employee employee);

    Long getLastEmployeeId();

    void deactivateEmployee(Long id);

    Employee updateEmployee(Long id, Employee employee);

}
