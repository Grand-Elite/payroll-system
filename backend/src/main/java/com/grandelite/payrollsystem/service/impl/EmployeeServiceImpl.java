package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.repository.DepartmentRepository;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.service.EmployeeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee findById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Long getLastEmployeeId() {
        return employeeRepository.findLastEmployeeId();
    }

    @Transactional
    public void deactivateEmployee(Long id) {
        employeeRepository.deactivateEmployee(id);
    }

    public Employee updateEmployee(Long id, Employee employee) {
        // Fetch the employee from the database
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Update employee fields (only the fields provided in the request body)
        if (employee.getShortName() != null) existingEmployee.setShortName(employee.getShortName());
        if (employee.getFullName() != null) existingEmployee.setFullName(employee.getFullName());
        if (employee.getDepartment() != null) existingEmployee.setDepartment(employee.getDepartment());
        if (employee.getDesignation() != null) existingEmployee.setDesignation(employee.getDesignation());
        if (employee.getNicNo() != null) existingEmployee.setNicNo(employee.getNicNo());
        if (employee.getEmployeeType() != null) existingEmployee.setEmployeeType(employee.getEmployeeType());
        if (employee.getEpfNo() != null) existingEmployee.setEpfNo(employee.getEpfNo());
        if (employee.getJoiningDate() != null) existingEmployee.setJoiningDate(employee.getJoiningDate()); // Update joiningDate
        if (employee.getNote() != null) existingEmployee.setNote(employee.getNote());   //update the notes

        // Save the updated employee back to the database
        return employeeRepository.save(existingEmployee);
    }
}
