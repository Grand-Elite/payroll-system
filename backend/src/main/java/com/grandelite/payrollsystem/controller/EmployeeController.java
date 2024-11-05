package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public Employee save(@RequestBody Employee employee){
        return employeeService.save(employee);
    }

    @GetMapping
    public List<Employee> findAll() {
        return employeeService.findAll();
    }

    @GetMapping("/{id}")
    public Employee findById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @GetMapping("/last-id")
    public ResponseEntity<Map<String, Integer>> getLastEmployeeId() {
        int lastEmployeeId = Math.toIntExact(employeeService.getLastEmployeeId()); // Assume this method fetches the last ID
        Map<String, Integer> response = new HashMap<>();
        response.put("employeeId", lastEmployeeId);
        return ResponseEntity.ok(response);
    }

}
