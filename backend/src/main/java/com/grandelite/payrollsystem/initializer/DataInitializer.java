package com.grandelite.payrollsystem.initializer;

import com.grandelite.payrollsystem.model.Shift;
import com.grandelite.payrollsystem.repository.ShiftRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.grandelite.payrollsystem.repository.DepartmentRepository; // Adjust the import according to your package structure
import com.grandelite.payrollsystem.model.Department; // Adjust the import according to your package structure

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Component
public class DataInitializer {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ShiftRepository shiftRepository; // Inject ShiftRepository

    @Bean
    public CommandLineRunner initializeDepartmentsAndShifts() {
        return args -> {
            // Populate department table if empty
            if (departmentRepository.count() == 0) {
                departmentRepository.save(new Department(1L, "Kitchen"));
                departmentRepository.save(new Department(2L, "Steward"));
                departmentRepository.save(new Department(3L, "Back Office"));
                departmentRepository.save(new Department(4L, "Front Office"));
                departmentRepository.save(new Department(5L, "Cleaning & Maintenance"));
            }

        // Fetch Department entities by their ID
            Department kitchenDepartment = departmentRepository.findById(1L).orElseThrow(() -> new RuntimeException("Department not found"));
            Department stewardDepartment = departmentRepository.findById(2L).orElseThrow(() -> new RuntimeException("Department not found"));
            Department cleaningDepartment = departmentRepository.findById(5L).orElseThrow(() -> new RuntimeException("Department not found"));
            Department backOfficeDepartment = departmentRepository.findById(3L).orElseThrow(() -> new RuntimeException("Department not found"));
            Department cashierDepartment = departmentRepository.findById(4L).orElseThrow(() -> new RuntimeException("Department not found"));

            if (shiftRepository.count() == 0) {
                shiftRepository.save(new Shift(1L,"Kitchen Morning Shift", LocalTime.of(7, 30), LocalTime.of(16, 30), kitchenDepartment));
                shiftRepository.save(new Shift(2L,"Kitchen Evening Shift", LocalTime.of(14, 30), LocalTime.of(23, 30), kitchenDepartment));
                shiftRepository.save(new Shift(3L,"Steward Morning Shift", LocalTime.of(7, 00), LocalTime.of(16, 00), stewardDepartment));
                shiftRepository.save(new Shift(4L,"Steward Evening Shift", LocalTime.of(15, 00), LocalTime.of(0, 00), stewardDepartment));
                shiftRepository.save(new Shift(5L,"Back Office Shift", LocalTime.of(8, 00), LocalTime.of(17, 00), backOfficeDepartment));
                shiftRepository.save(new Shift(6L,"Cashier & Bar Shift", LocalTime.of(10, 00), LocalTime.of(0, 00), cashierDepartment));
                shiftRepository.save(new Shift(7L,"Cleaning & Maintenance Shift", LocalTime.of(7, 30), LocalTime.of(17, 00), cleaningDepartment));
            }
        };
    }
}
