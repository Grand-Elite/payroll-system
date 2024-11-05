package com.grandelite.payrollsystem.initializer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.grandelite.payrollsystem.repository.DepartmentRepository; // Adjust the import according to your package structure
import com.grandelite.payrollsystem.model.Department; // Adjust the import according to your package structure

@Component
public class DataInitializer {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Bean
    public CommandLineRunner initializeDepartments() {
        return args -> {
            // Check if the department table is empty before inserting
            if (departmentRepository.count() == 0) {
                departmentRepository.save(new Department(1L, "Kitchen"));
                departmentRepository.save(new Department(2L, "Steward"));
                departmentRepository.save(new Department(3L, "Back Office"));
                departmentRepository.save(new Department(4L, "Front Office"));
                departmentRepository.save(new Department(5L, "Cleaning & Maintenance"));
            }
        };
    }
}
