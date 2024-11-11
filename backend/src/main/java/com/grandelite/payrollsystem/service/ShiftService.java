package com.grandelite.payrollsystem.service;

import com.grandelite.payrollsystem.model.Shift;
import com.grandelite.payrollsystem.repository.ShiftRepository;

import java.util.List;
import java.util.Optional;

public interface ShiftService {

    List<Shift> getAllShifts();

    Optional<Shift> getShiftById(Long id);

    Shift saveShift(Shift shift);
}
