package com.danielbattisti.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ProjectRequest(
        @NotBlank(message = "Título é obrigatório") String title,
        @NotBlank(message = "Descrição é obrigatória") String description,
        String imageUrl,
        String repoUrl,
        String demoUrl,
        List<String> techStack,
        boolean featured,
        Integer displayOrder) {
}
