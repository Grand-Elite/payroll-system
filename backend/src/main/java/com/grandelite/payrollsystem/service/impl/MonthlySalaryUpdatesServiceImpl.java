package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Employee;
import com.grandelite.payrollsystem.model.MonthlyFullSalary;
import com.grandelite.payrollsystem.model.MonthlySalaryUpdates;
import com.grandelite.payrollsystem.repository.EmployeeRepository;
import com.grandelite.payrollsystem.repository.MonthlySalaryUpdatesRepository;
import com.grandelite.payrollsystem.service.MonthlyFullSalaryService;
import com.grandelite.payrollsystem.service.MonthlySalaryUpdatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.Optional;

@Service
public class MonthlySalaryUpdatesServiceImpl implements MonthlySalaryUpdatesService {

    @Autowired
    private MonthlySalaryUpdatesRepository repository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    private MonthlyFullSalaryService monthlyFullSalaryService;

    public MonthlySalaryUpdatesServiceImpl(MonthlySalaryUpdatesRepository repository, EmployeeRepository employeeRepository) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
    }


    @Override
    public MonthlySalaryUpdates createSalaryUpdate(Long employeeId, String year, String month,  MonthlySalaryUpdates salaryUpdate) {
        Optional<MonthlySalaryUpdates>  existingMonthlySalaryDetails = repository.findByEmployee_EmployeeIdAndYearAndMonth(employeeId, year, month);

        if(existingMonthlySalaryDetails.isPresent()){
            return null;
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        salaryUpdate.setYear(year);
        salaryUpdate.setMonth(month);
        salaryUpdate.setEmployee(employee);
        salaryUpdate.setMonthlySalaryUpdatesRecordId(employeeId+":"+year+":"+month);
        MonthlySalaryUpdates monthlyFullSalary = repository.save(salaryUpdate);
        monthlyFullSalaryService.calculateMonthlyFullSalary(employee.getEmployeeId(),year,
                Month.valueOf(month.toUpperCase()).getValue());
        return monthlyFullSalary;
    }

    @Override
    public Optional<MonthlySalaryUpdates> findByEmployee_EmployeeIdAndYearAndMonth(Long employeeId, String year, String month, MonthlySalaryUpdates salaryUpdate) {
        return Optional.empty();
    }

    @Override
    public Optional<MonthlySalaryUpdates> updateSalaryUpdateByEmployeeId(Long employeeId, String year, String month, MonthlySalaryUpdates salaryUpdate) {
        return repository.findByEmployee_EmployeeIdAndYearAndMonth(employeeId, year, month)
                .map(existing -> {
                    // Update the fields with the new values
                    existing.setBonus(salaryUpdate.getBonus());
                    existing.setIncentives(salaryUpdate.getIncentives());
                    existing.setMonthEncouragementAllowance(salaryUpdate.getMonthEncouragementAllowance());
                    existing.setSalaryAdvance(salaryUpdate.getSalaryAdvance());
                    existing.setFoodBill(salaryUpdate.getFoodBill());
                    existing.setArrears(salaryUpdate.getArrears());
                    existing.setOtherDeductions(salaryUpdate.getOtherDeductions());

                    // Save the updated record back to the repository
                    MonthlySalaryUpdates monthlySalaryUpdates = repository.save(existing);
                    monthlyFullSalaryService.calculateMonthlyFullSalary(employeeId,year,
                            Month.valueOf(month.toUpperCase()).getValue());
                    return monthlySalaryUpdates;
                });
    }

    public Optional<MonthlySalaryUpdates> getMonthlySalaryUpdatesByEmployeeId(Long employeeId, String year, String month){
        return repository.findByEmployee_EmployeeIdAndYearAndMonth(employeeId, year, month);
    }
}
