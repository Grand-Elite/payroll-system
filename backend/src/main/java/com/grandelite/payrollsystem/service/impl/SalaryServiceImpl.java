package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.SalaryBase;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.SalaryRepository;
import com.grandelite.payrollsystem.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SalaryServiceImpl implements SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public SalaryServiceImpl(SalaryRepository salaryRepository, EmployeeRepository employeeRepository) {
        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
    }

    /*
    @Override
    public SalaryBase getSalaryDetailsByEmployeeId(Long employeeId) {
        // Use orElseGet to return default salary if not found
        return salaryRepository.findByEmployeeEmployeeId(employeeId)
                .orElseGet(this::createDefaultSalaryBase);  // Using orElseGet to provide the default object
    }

     */

    @Override
    public SalaryBase getSalaryDetailsByEmployeeId(Long employeeId) {
        // Use orElseGet to return default salary if not found
        return salaryRepository.findByEmployeeEmployeeId(employeeId)
                .orElseGet(() -> {
                    SalaryBase defaultSalaryBase = createDefaultSalaryBase();
                    defaultSalaryBase.setBasicSalary(0.0); // indicate no record found
                    return defaultSalaryBase;
                });
    }
    // Method to create a default SalaryBase object with 0 values
    private SalaryBase createDefaultSalaryBase() {
        SalaryBase defaultSalaryBase = new SalaryBase();
        defaultSalaryBase.setBasicSalary(0.0);
        defaultSalaryBase.setAttendanceAllowance(0.0);
        defaultSalaryBase.setTransportAllowance(0.0);
        defaultSalaryBase.setPerformanceAllowance(0.0);
        defaultSalaryBase.setOt1Rate(0.0);
        defaultSalaryBase.setOt2Rate(0.0);
        defaultSalaryBase.setIncentives(0.0);
        defaultSalaryBase.setSalaryAdvance(0.0);
        defaultSalaryBase.setFoodBill(0.0);
        defaultSalaryBase.setArrears(0.0);
        defaultSalaryBase.setOtherDeductions(0.0);
        defaultSalaryBase.setBonus(0.0);
        defaultSalaryBase.setLateChargesPerMin(0.0);
        return defaultSalaryBase;
    }

    @Override
    public String updateSalaryDetails(Long employeeId, SalaryBase updatedSalaryDetails) {
        Optional<SalaryBase> salaryBaseOptional = salaryRepository.findByEmployeeEmployeeId(employeeId);

        if (salaryBaseOptional.isPresent()) {
            SalaryBase existingSalaryBase = salaryBaseOptional.get();

            // Update the fields directly
            existingSalaryBase.setBasicSalary(updatedSalaryDetails.getBasicSalary());
            existingSalaryBase.setBonus(updatedSalaryDetails.getBonus());
            existingSalaryBase.setAttendanceAllowance(updatedSalaryDetails.getAttendanceAllowance());
            existingSalaryBase.setTransportAllowance(updatedSalaryDetails.getTransportAllowance());
            existingSalaryBase.setPerformanceAllowance(updatedSalaryDetails.getPerformanceAllowance());
            existingSalaryBase.setIncentives(updatedSalaryDetails.getIncentives());
            existingSalaryBase.setSalaryAdvance(updatedSalaryDetails.getSalaryAdvance());
            existingSalaryBase.setFoodBill(updatedSalaryDetails.getFoodBill());
            existingSalaryBase.setArrears(updatedSalaryDetails.getArrears());
            existingSalaryBase.setOtherDeductions(updatedSalaryDetails.getOtherDeductions());
            existingSalaryBase.setOt1Rate(updatedSalaryDetails.getOt1Rate());
            existingSalaryBase.setOt2Rate(updatedSalaryDetails.getOt2Rate());
            existingSalaryBase.setLateChargesPerMin(updatedSalaryDetails.getLateChargesPerMin());

            salaryRepository.save(existingSalaryBase);
            return "Salary details updated successfully!";
        } else {
            return "Employee not found.";
        }
    }

    @Override
    public SalaryBase createSalaryDetails(Long employeeId, SalaryBase salaryDetails) {
        // Check if salary details already exist for the employee
        Optional<SalaryBase> existingSalaryDetails = salaryRepository.findByEmployeeEmployeeId(employeeId);

        if (existingSalaryDetails.isPresent()) {
            return null; // Return null to indicate a bad request
        }

        // Retrieve the employee details
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Set the employee in the salary details
        salaryDetails.setEmployee(employee);

        // Save and return the new salary details
        return salaryRepository.save(salaryDetails);
    }
}

