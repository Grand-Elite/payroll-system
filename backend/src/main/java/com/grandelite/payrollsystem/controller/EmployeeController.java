package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
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
        Long lastEmployeeId = employeeService.getLastEmployeeId();  // Assuming this fetches the last ID as Long
        int lastEmployeeIdInt = (lastEmployeeId != null) ? Math.toIntExact(lastEmployeeId) : 0; // Default to 0 if null
        Map<String, Integer> response = new HashMap<>();
        response.put("employeeId", lastEmployeeIdInt);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateEmployee(@PathVariable Long id) {
        employeeService.deactivateEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.findById(id); // Assuming a service method here
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(employee);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employee);
            return ResponseEntity.ok(updatedEmployee);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to update employee details");
        }
    }


}
