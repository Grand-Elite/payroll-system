package com.grandelite.payrollsystem.controller;

import com.grandelite.payrollsystem.model.OverwrittenAttendanceStatus;
import com.grandelite.payrollsystem.model.Shift;
import com.grandelite.payrollsystem.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    @Autowired
    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    // Fetch all shifts
    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    // Handle updating a shift
    @PatchMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Long id, @RequestBody Shift shiftToUpdate) {
        Optional<Shift> existingShiftOpt = shiftService.getShiftById(id);

        if (!existingShiftOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // Return 404 if shift not found
        }

        Shift existingShift = existingShiftOpt.get();

        // Update shift details
        existingShift.setStartTime(shiftToUpdate.getStartTime());
        existingShift.setEndTime(shiftToUpdate.getEndTime());
        existingShift.setShiftType(shiftToUpdate.getShiftType());

        // Save the updated shift
        Shift updatedShift = shiftService.saveShift(existingShift);

        return ResponseEntity.ok(updatedShift); // Return the updated shift
    }



}
