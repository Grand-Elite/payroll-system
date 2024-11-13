package com.grandelite.payrollsystem.service.impl;

import com.grandelite.payrollsystem.model.Shift;
import com.grandelite.payrollsystem.repository.ShiftRepository;
import com.grandelite.payrollsystem.service.ShiftService; // Import the interface
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShiftServiceImpl implements ShiftService { // Implement the interface

    private final ShiftRepository shiftRepository;

    @Autowired
    public ShiftServiceImpl(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @Override
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    @Override
    public Optional<Shift> getShiftById(Long id) {
        return shiftRepository.findById(String.valueOf(id));
    }

    @Override
    public Shift saveShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    public List<Shift> getShiftByDepartmentId(Long departmentId) {
        return shiftRepository.findShiftByDepartmentId(departmentId);
    }
}
