package com.danielbattisti.portfolio.dto;

import com.danielbattisti.portfolio.model.PlanStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PlanRequest(
        @NotBlank(message = "Título é obrigatório") String title,
        @NotBlank(message = "Descrição é obrigatória") String description,
        @NotNull(message = "Status é obrigatório") PlanStatus status,
        LocalDate targetDate,
        Integer displayOrder) {
}
