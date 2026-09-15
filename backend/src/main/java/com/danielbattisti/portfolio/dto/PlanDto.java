package com.danielbattisti.portfolio.dto;

import com.danielbattisti.portfolio.model.PlanStatus;
import java.time.Instant;
import java.time.LocalDate;

public record PlanDto(
        Long id,
        String title,
        String description,
        PlanStatus status,
        LocalDate targetDate,
        Integer displayOrder,
        Instant createdAt) {
}
